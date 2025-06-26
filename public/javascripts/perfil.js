document.addEventListener('DOMContentLoaded', () => {
  console.log('Perfil carregado.');
  console.log('Criados hidden:', document.getElementById('pins-criados').hidden);
  console.log('Favoritos hidden:', document.getElementById('pins-favoritos').hidden);

  const tabs = document.querySelectorAll('.tabs button');
  const panels = {
    criados: document.getElementById('pins-criados'),
    favoritos: document.getElementById('pins-favoritos'),
  };

  // Inicializa atributos ARIA e visibilidade correta ao carregar
  tabs.forEach((tab, i) => {
    const id = tab.id === 'tab-criados' ? 'criados' : 'favoritos';
    const selected = i === 0; // primeira aba ativa por padrão
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', selected ? 'true' : 'false');
    tab.setAttribute('tabindex', selected ? '0' : '-1');
    if (panels[id]) {
      panels[id].hidden = !selected;
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active e atualiza aria-selected/tabindex em todas as abas
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      // Esconde todos os painéis
      Object.values(panels).forEach(panel => {
        if (panel) panel.hidden = true;
      });

      // Ativa a aba clicada e mostra painel correspondente
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');

      const id = tab.id === 'tab-criados' ? 'criados' : 'favoritos';
      if (panels[id]) {
  panels[id].hidden = false;
  requestAnimationFrame(() => {
    ativarEventosModal();
  });
}
    });

    // Suporte ao teclado (Enter/Space)
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
  });

  const btnTop = document.getElementById('btn-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnTop.classList.add('show');
    } else {
      btnTop.classList.remove('show');
    }
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Modal
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');

  function openModal(img) {
    modalImg.src = img.src;
    modalImg.alt = img.alt || '';
    modalTitle.textContent = img.dataset.title || '';
    modal.hidden = false;
    modalClose.focus();
    document.body.style.overflow = 'hidden'; // trava scroll do fundo
  }

  function closeModal() {
    modal.hidden = true;
    modalImg.src = '';
    modalTitle.textContent = '';
    document.body.style.overflow = ''; // libera scroll
  }

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  function ativarEventosModal() {
    document.querySelectorAll('.pin img').forEach(img => {
      if (!img.dataset.modalBound) {
        img.tabIndex = 0;
        img.addEventListener('click', () => openModal(img));
        img.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(img);
          }
        });
        img.dataset.modalBound = "true";
      }
    });
  }

  // Ativa os eventos nas imagens visíveis ao carregar a página
  ativarEventosModal();

  // Mostrar select de categorias ao clicar na aba Criados
  const tabCriados = document.getElementById('tab-criados');
  const filtroCategorias = document.getElementById('filtro-categorias-criados');
  const categoriaSelectJS = document.getElementById('categoriaSelectJS');
  const gridCriados = document.getElementById('pins-criados');

  if (tabCriados && filtroCategorias) {
    tabCriados.addEventListener('click', () => {
      filtroCategorias.hidden = false;
    });
  }

  if (categoriaSelectJS && gridCriados) {
    categoriaSelectJS.addEventListener('change', function () {
      const selected = this.value;
      document.querySelectorAll('#pins-criados .pin').forEach(pin => {
        if (!selected || pin.dataset.categoriaId === selected) {
          pin.style.display = '';
        } else {
          pin.style.display = 'none';
        }
      });
    });
  }
});