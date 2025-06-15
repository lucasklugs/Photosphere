document.addEventListener("DOMContentLoaded", () => {
  const inputFotoPerfil = document.querySelector('input[name="foto_perfil"]');
  const previewFotoPerfil = document.querySelector(".profile-photo");

  const inputFotoCover = document.querySelector('input[name="foto_cover"]');
  const previewFotoCover = document.querySelector(".cover-photo");

  if (inputFotoPerfil && previewFotoPerfil) {
    inputFotoPerfil.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewFotoPerfil.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (inputFotoCover && previewFotoCover) {
    inputFotoCover.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewFotoCover.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const deleteBtn = document.querySelector('.delete-btn');

  deleteBtn.addEventListener('click', async () => {
    const confirmDelete = confirm('Tem certeza que deseja deletar sua conta? Essa ação é irreversível!');
    if (!confirmDelete) return;

    try {
      const response = await fetch('/config/deletar-conta', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Conta deletada com sucesso! Você será redirecionado.');
        window.location.href = '/logout';
      } else {
        const errorText = await response.text();
        alert('Erro ao deletar conta: ' + errorText);
      }
    } catch (err) {
      alert('Erro na requisição: ' + err.message);
    }
  });
});