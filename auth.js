// Função para cadastrar um usuário
async function handleRegister(nome, email, senha, confirmarSenha) {
  // Verifica se as senhas são iguais
  if (senha !== confirmarSenha) {
    // Se não forem, lança um erro com essa mensagem
    throw new Error('As senhas não coincidem.');
  }

  // Realiza uma requisição POST para o endpoint /register com os dados do usuário
  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha }), // converte dados para JSON
  });

  // Lê o texto da resposta
  const text = await response.text();

  // Se a resposta não for OK (status >= 200 e < 300), lança um erro com a mensagem da resposta
  if (!response.ok) {
    throw new Error(text);
  }

  // Caso tudo tenha dado certo, retorna a mensagem de sucesso
  return 'Cadastro realizado com sucesso!';
}

// Função para fazer login
async function handleLogin(email, senha) {
  // Requisição POST para o endpoint /login com email e senha
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  // Lê o texto da resposta
  const text = await response.text();

  // Se não for sucesso, lança erro com mensagem
  if (!response.ok) {
    throw new Error(text);
  }

  // Caso sucesso, retorna mensagem
  return 'Login efetuado com sucesso!';
}

// Exporta as funções para serem usadas em outros arquivos (como os testes)
module.exports = { handleRegister, handleLogin };
