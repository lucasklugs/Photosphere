require('dotenv').config();
const mysql = require('mysql2');

// Exibir credenciais carregadas
console.log("Credenciais carregadas:", process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'photosphere',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Teste de conexão
pool.getConnection()
    .then(conn => {
        console.log('✅ Banco de dados conectado!');
        conn.release(); // Libera a conexão
    })
    .catch(err => console.error('❌ Erro ao conectar ao banco:', err));

async function buscarAdmin(usuario) {
    const sql = "SELECT * FROM admin WHERE admemail=? AND admsenha=?;";
    const [adminEncontrado] = await pool.query(sql, [usuario.email, usuario.senha]);

    if (adminEncontrado && adminEncontrado.length > 0) {
        return adminEncontrado[0];
    } else {
        return {};
    }
}

async function buscarUsuarios() {
  const [rows] = await pool.query("SELECT id, nome, email, 'Usuário' AS tipo FROM usuarios;");
  return rows;
}

module.exports = { pool, buscarAdmin, buscarUsuarios };

