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

//Botão coração
document.querySelectorAll('.heart-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Redireciona para a seção de favoritos, pode ser uma página ou um id na mesma página
      window.location.href = '/favoritos'; // ou '#favoritos' se for ancoragem
    });
});

//Grid de imagens
const photoGrid = document.getElementById('photo-grid');
  const images = [
    '/images/gato.jpg',
    '/images/arara.jpg',
    '/images/tucano.jpg',
    '/images/hamburguer.jpg',
    '/images/balao.jpg',
    '/images/folha.jpg',
    '/images/lagarto.jpg',
    '/images/flor.jpg',
    '/images/rio.jpg',
    '/images/gato.jpg',
    '/images/arara.jpg',
    '/images/tucano.jpg',
    '/images/hamburguer.jpg',
    '/images/balao.jpg',
    '/images/folha.jpg',
    '/images/lagarto.jpg',
    '/images/flor.jpg',
    '/images/rio.jpg',
    '/images/gato.jpg',
    '/images/arara.jpg',
    '/images/tucano.jpg',
    '/images/hamburguer.jpg',
    '/images/balao.jpg',
    '/images/folha.jpg',
    '/images/lagarto.jpg',
    '/images/flor.jpg',
    '/images/rio.jpg'
  ];

  images.forEach(src => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <div class="photo-content" style="background-image: url('${src}')">
        <div class="overlay">
          <button class="heart-btn" aria-label="Favoritar">
            <img src="/images/heart.png" alt="Coração vermelho" />
          </button>
        </div>
      </div>
    `;
    photoGrid.appendChild(card);
  });