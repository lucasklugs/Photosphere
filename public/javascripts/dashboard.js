function abrirModal(userId, userName, tipo) {
    const modal = document.getElementById('modalConfirmacao');
    const texto = document.getElementById('textoModal');
    const form = document.getElementById('formExcluir');

    texto.textContent = `Tem certeza que deseja excluir o ${tipo} "${userName}"?`;
    form.action = tipo === 'Usuário' ? `/admin/usuarios/excluir/${userId}` : `/admin/admins/excluir/${userId}`;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalConfirmacao').style.display = 'none';
}

function alterarTipo(userId, tipoAtual, selectElement) {
    const tipoNovo = selectElement.value;
    if (tipoAtual === 'Usuário' && tipoNovo === 'admin') {
        document.getElementById(`form-promover-${userId}`).submit();
      } else if (tipoAtual === 'Admin' && tipoNovo === 'usuario') {
        document.getElementById(`form-rebaixar-${userId}`).submit();
    }
}

function trocarAba(aba) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${aba}`).classList.add('active');
    document.getElementById(`btn-${aba}`).classList.add('active');
}

window.onload = () => trocarAba('usuarios');