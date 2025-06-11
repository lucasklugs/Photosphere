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

// Função buscarAdmin
async function buscarAdmin(usuario) {
    const sql = "SELECT * FROM admin WHERE admemail=? AND admsenha=?;";
    const [adminEncontrado] = await pool.query(sql, [usuario.email, usuario.senha]);

    if (adminEncontrado && adminEncontrado.length > 0) {
        return adminEncontrado[0];
    } else {
        return {};
    }
}

//Função buscarUsuarios
async function buscarUsuarios() {
  const [rows] = await pool.query("SELECT id, nome, email, 'Usuário' AS tipo FROM usuarios;");
  return rows;
}

//Função excluirUsuario
async function excluirUsuario(id) {
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  await pool.query(sql, [id]);
}

//Função buscarCategorias
async function buscarCategorias() {
  const [rows] = await pool.query("SELECT id, nome FROM categorias;");
  return rows;
}

//Função excluirCategoria
async function excluirCategoria(id) {
  const sql = 'DELETE FROM categorias WHERE id = ?';
  await pool.query(sql, [id]);
}

//Função adicionarCategoria
async function adicionarCategoria(nome) {
  const sql = 'INSERT INTO categorias (nome) VALUES (?);';
  await pool.query(sql, [nome]);
}

//Função atualizarCategoria
async function atualizarCategoria(id, nome) {
  const sql = 'UPDATE categorias SET nome = ? WHERE id = ?;';
  await pool.query(sql, [nome, id]);
}

// Função para adicionar uma curtida
async function adicionarCurtida(usuarioId, fotoId) {
  const sql = 'INSERT IGNORE INTO curtidas (usuario_id, foto_id) VALUES (?, ?)';
  await pool.query(sql, [usuarioId, fotoId]);
}

// Buscar fotos favoritas de um usuário
async function buscarFavoritosPorUsuario(usuarioId) {
  const sql = `
    SELECT f.id, f.titulo, f.url AS imageUrl
    FROM fotos f
    JOIN curtidas c ON c.foto_id = f.id
    WHERE c.usuario_id = ?`;
  const [rows] = await pool.query(sql, [usuarioId]);
  return rows;
}

// Buscar fotos com informações de categorias e se estão favoritas para um usuário específico
async function buscarFotosComFavoritos(usuarioId) {
  const sql = `
    SELECT 
      f.id,
      f.titulo,
      f.descricao,
      f.url,
      GROUP_CONCAT(ca.nome) AS categorias,
      CASE WHEN cu.id IS NULL THEN 0 ELSE 1 END AS favoritado
    FROM fotos f
    LEFT JOIN fotos_categorias fc ON fc.foto_id = f.id
    LEFT JOIN categorias ca ON ca.id = fc.categoria_id
    LEFT JOIN curtidas cu ON cu.foto_id = f.id AND cu.usuario_id = ?
    GROUP BY f.id
  `;
  const [rows] = await pool.query(sql, [usuarioId]);
  return rows;
}
module.exports = { pool, buscarAdmin, buscarUsuarios, excluirUsuario, buscarCategorias, excluirCategoria, 
  adicionarCategoria, atualizarCategoria, adicionarCurtida, buscarFavoritosPorUsuario, buscarFotosComFavoritos };
