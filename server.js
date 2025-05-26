require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const connection = require('./db');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Página de login
app.get('/', (req, res) => {
    res.render('login');
});

// Cadastro de usuário
app.post('/register', async (req, res) => {
    try {
        const { nome, email, senha, foto_perfil } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios!');
        }

        // Verifica se o e-mail já está cadastrado
        const [rows] = await connection.execute("SELECT email FROM usuarios WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(409).send('E-mail já cadastrado!');
        }

        // Hash da senha
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        // Inserir usuário no banco
        await connection.execute(
            'INSERT INTO usuarios (nome, email, senha_hash, foto_perfil) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, foto_perfil || null]
        );

        res.status(201).send('✅ Usuário cadastrado com sucesso!');
    } catch (err) {
        console.error('❌ Erro ao registrar:', err);
        res.status(500).send('Erro ao registrar');
    }
});

// Login de usuário
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const [results] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(401).send('Usuário não encontrado');
        }

        const user = results[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).send('Senha incorreta');
        }

        res.status(200).send('✅ Login bem-sucedido!');
    } catch (err) {
        console.error('❌ Erro no login:', err);
        res.status(500).send('Erro no login');
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});