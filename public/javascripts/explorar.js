//Botão voltar para o topo
document.getElementById('btnVoltarTopo').addEventListener('click', function() {
window.scrollTo({ top: 0, behavior: 'smooth' });
});

//Data atual automático
function formatDateBR(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dateDiv = document.getElementById('current-date');
    const today = new Date();
    dateDiv.textContent = formatDateBR(today);
});

// Botão coração - envia favorito
document.querySelectorAll('.heart-btn').forEach(button => {
  button.addEventListener('click', () => {
    const fotoId = button.dataset.id;
    const img = button.querySelector('img');
    const favoritado = img.src.includes('heart-filled.png');

    fetch('/favoritar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fotoId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.favoritado) {
        img.src = '/images/heart-filled.png';
      } else {
        img.src = '/images/heart.png';
      }
    })
    .catch(err => {
      console.error('Erro ao favoritar/desfavoritar:', err);
    });
  });
});
