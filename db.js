require('dotenv').config();
const mysql = require('mysql2');

// Exibe as credenciais carregadas
console.log("Credenciais carregadas:", process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);

// Criação do pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'photosphere',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Testa a conexão com o banco
pool.getConnection()
    .then(conn => {
        console.log('✅ Banco de dados conectado!');
        conn.release();
    })
    .catch(err => console.error('❌ Erro ao conectar ao banco:', err));

// === Funções de administração ===
async function buscarAdmin(usuario) {
    const sql = "SELECT * FROM admin WHERE admemail=? AND admsenha=?;";
    const [adminEncontrado] = await pool.query(sql, [usuario.email, usuario.senha]);
    return adminEncontrado.length > 0 ? adminEncontrado[0] : {};
}

// === Funções para usuários ===
async function buscarUsuarios() {
    const [rows] = await pool.query("SELECT id, nome, email, 'Usuário' AS tipo FROM usuarios;");
    return rows;
}

async function excluirUsuario(id) {
    const sql = 'DELETE FROM usuarios WHERE id = ?';
    await pool.query(sql, [id]);
}

// === Funções para categorias ===
async function buscarCategorias() {
    const [rows] = await pool.query("SELECT id, nome FROM categorias;");
    return rows;
}

async function excluirCategoria(id) {
    const sql = 'DELETE FROM categorias WHERE id = ?';
    await pool.query(sql, [id]);
}

async function adicionarCategoria(nome) {
    const sql = 'INSERT INTO categorias (nome) VALUES (?);';
    await pool.query(sql, [nome]);
}

async function atualizarCategoria(id, nome) {
    const sql = 'UPDATE categorias SET nome = ? WHERE id = ?;';
    await pool.query(sql, [nome, id]);
}

// === Funções de curtidas ===
async function adicionarCurtida(usuarioId, fotoId) {
    const sql = 'INSERT IGNORE INTO curtidas (usuario_id, foto_id) VALUES (?, ?)';
    await pool.query(sql, [usuarioId, fotoId]);
}

async function buscarFavoritosPorUsuario(usuarioId) {
    const sql = `
        SELECT f.id, f.titulo, f.url AS imageUrl
        FROM fotos f
        JOIN curtidas c ON c.foto_id = f.id
        WHERE c.usuario_id = ?`;
    const [rows] = await pool.query(sql, [usuarioId]);
    return rows;
}

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

// === Funções para pins ===
async function buscarPinPorId(pinId) {
    const [rows] = await pool.query(`
        SELECT f.id, f.titulo, f.descricao, f.url AS imagemUrl, u.nome AS autor
        FROM fotos f
        JOIN usuarios u ON f.usuario_id = u.id
        WHERE f.id = ?
    `, [pinId]);
    return rows[0];
}

// === Funções para comentários ===
async function buscarComentariosPorFoto(fotoId) {
    const [rows] = await pool.query(`
        SELECT c.texto, u.nome
        FROM comentarios c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.foto_id = ?
        ORDER BY c.data_comentario DESC
    `, [fotoId]);
    return rows;
}

async function adicionarComentario(usuarioId, fotoId, texto) {
    await pool.query(`
        INSERT INTO comentarios (usuario_id, foto_id, texto)
        VALUES (?, ?, ?)
    `, [usuarioId, fotoId, texto]);
}

// Exportação das funções
module.exports = {
    pool,
    buscarAdmin,
    buscarUsuarios,
    excluirUsuario,
    buscarCategorias,
    excluirCategoria,
    adicionarCategoria,
    atualizarCategoria,
    adicionarCurtida,
    buscarFavoritosPorUsuario,
    buscarFotosComFavoritos,
    buscarPinPorId,
    buscarComentariosPorFoto,
    adicionarComentario
};
