/**
 * @jest-environment jsdom
 */

// Importa as funções do arquivo auth.js usando CommonJS (require)
const { handleRegister, handleLogin } = require('../auth.js');

// Mock global da função fetch para simular chamadas HTTP
global.fetch = jest.fn();

describe('Testes de autenticação com usuário Matheus', () => {
  // Antes de cada teste, limpa o mock do fetch para evitar interferência entre testes
  beforeEach(() => {
    fetch.mockClear();
  });

  test('Cadastro com sucesso - novo usuário', async () => {
    // Simula uma resposta positiva da API
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Success',
    });

    // Testa se a função handleRegister resolve com a mensagem de sucesso
    await expect(handleRegister('Usuário Teste', 'teste@example.com', '123456', '123456'))
      .resolves.toBe('Cadastro realizado com sucesso!');

    // Verifica se a fetch foi chamada com os parâmetros corretos
    expect(fetch).toHaveBeenCalledWith('/register', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: '123456',
      }),
    }));
  });

  test('Cadastro com senhas diferentes deve lançar erro', async () => {
    // Testa se o cadastro falha quando as senhas não coincidem
    await expect(handleRegister('Matheus Ferreira Fagundes', 'matheusferreirafagundes23@gmail.com', '123', '321'))
      .rejects.toThrow('As senhas não coincidem.');
  });

  test('Falha no cadastro com email já cadastrado', async () => {
    // Simula resposta de erro de email já cadastrado
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Email já cadastrado',
    });

    // Testa se o handleRegister lança erro com mensagem correta
    await expect(handleRegister('Matheus Ferreira Fagundes', 'matheusferreirafagundes23@gmail.com', '123', '123'))
      .rejects.toThrow('Email já cadastrado');
  });

  test('Login com sucesso - usuário Matheus', async () => {
    // Simula resposta positiva para login
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Success',
    });

    // Testa se handleLogin resolve com mensagem de sucesso
    await expect(handleLogin('matheusferreirafagundes23@gmail.com', '123'))
      .resolves.toBe('Login efetuado com sucesso!');

    // Verifica se a fetch foi chamada com os parâmetros corretos para login
    expect(fetch).toHaveBeenCalledWith('/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        email: 'matheusferreirafagundes23@gmail.com',
        senha: '123',
      }),
    }));
  });

  test('Login com senha errada deve lançar erro', async () => {
    // Simula resposta de erro para senha incorreta
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Senha incorreta',
    });

    // Testa se handleLogin lança erro com a mensagem correta
    await expect(handleLogin('matheusferreirafagundes23@gmail.com', 'senhaErrada'))
      .rejects.toThrow('Senha incorreta');
  });
});
