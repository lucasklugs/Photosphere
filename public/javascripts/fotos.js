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
          <button class="x-btn" aria-label="Deletar">
            <img src="/images/x.png" alt="X - Deletar" />
          </button>
        </div>
      </div>
    `;
    photoGrid.appendChild(card);
  });