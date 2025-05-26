const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Animação dos botões "Entrar" e "Cadastrar-se"
registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.sign-in form');
  const registerForm = document.querySelector('.sign-up form');
  const loginLink = document.querySelector('.sign-up .underline');
  const registerLink = document.querySelector('.sign-in .underline');

  // Navegação entre formulários no modo mobile
  loginLink.addEventListener('click', () => {
    container.classList.remove('active');
  });

  registerLink.addEventListener('click', () => {
    container.classList.add('active');
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const senha = loginForm.querySelector('input[type="password"]').value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const text = await response.text();

      if (response.ok) {
        // Redirecionar para página principal
        window.location.href = '/explorar';
      } else {
        alert('⚠️ Erro: ' + text);
      }
    } catch (err) {
      console.error('Erro no login:', err);
      alert('❌ Erro ao tentar fazer login.');
    }
  });

  // Cadastro
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const senhas = registerForm.querySelectorAll('input[type="password"]');
    const senha = senhas[0].value;
    const confirmarSenha = senhas[1].value;

    if (senha !== confirmarSenha) {
      return alert('❌ As senhas não coincidem.');
    }

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const text = await response.text();

      if (response.ok) {
        alert('✅ Cadastro realizado com sucesso!');
        container.classList.remove('active'); // Volta para o login após cadastro
      } else {
        alert('⚠️ Erro: ' + text);
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      alert('❌ Erro ao tentar cadastrar.');
    }
  });
});