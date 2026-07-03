const BASE_URL = 'http://localhost:5000';

// NAVEGAÇÃO

const secoes = document.querySelectorAll('section');
const botoesNav = document.querySelectorAll('nav button');

function mostrarSecao(id) {
    secoes.forEach(s => s.classList.remove('ativa'));
    botoesNav.forEach(b => b.classList.remove('ativo'));

    document.getElementById(id).classList.add('ativa');
    document.querySelector(`nav button[data-secao="${id}"]`).classList.add('ativo');
}

botoesNav.forEach(btn => {
    btn.addEventListener('click', () => {
        const secao = btn.dataset.secao;
        mostrarSecao(secao);
        if (secao === 'inventario') carregarInventario();
    });
});

// CATEGORIAS

async function carregarCategorias() {
    const res = await fetch(`${BASE_URL}/categorias`);
    const dados = await res.json();
    const categorias = dados.categorias;

    const selects = [
        document.getElementById('filtro-categoria'),
        document.getElementById('categoria'),
        document.getElementById('editar-categoria'),
    ];

    selects.forEach(sel => {
        const primeiraOpcao = sel.options[0];
        sel.innerHTML = '';
        sel.appendChild(primeiraOpcao);
        categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.nome;
            sel.appendChild(opt);
        });
    });
}

// PEDAIS

async function carregarPedais(categoriaId = '') {
    const url = categoriaId
        ? `${BASE_URL}/pedais?categoria_id=${categoriaId}`
        : `${BASE_URL}/pedais`;

    const res = await fetch(url);
    const dados = await res.json();
    renderizarPedais(dados.pedais);
}

function renderizarPedais(pedais) {
    const lista = document.getElementById('lista-pedais');
    lista.innerHTML = '';

    if (pedais.length === 0) {
        lista.innerHTML = '<p class="vazio">Nenhum pedal encontrado.</p>';
        return;
    }

    pedais.forEach(pedal => {
        const card = document.createElement('div');
        card.className = 'card-pedal';
        card.innerHTML = `
            ${pedal.imagem ? `<img src="${pedal.imagem}" alt="${pedal.nome}" onerror="this.style.display='none'">` : ''}
            <span class="categoria-tag">${pedal.categoria_nome || 'Sem categoria'}</span>
            <h3>${pedal.nome}</h3>
            <p>${pedal.descricao}</p>
            <div class="acoes">
                <button class="btn-secundario" onclick="abrirEditar(${pedal.id}, '${escapar(pedal.nome)}', '${escapar(pedal.descricao)}', ${pedal.categoria_id}, '${escapar(pedal.imagem || '')}')">Editar</button>
                <button class="btn-perigo" onclick="deletarPedal(${pedal.id})">Remover</button>
                <button class="btn-primario" onclick="adicionarAoInventario(${pedal.id})">+ Inventário</button>
            </div>
        `;
        lista.appendChild(card);
    });
}

function escapar(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Filtro por categoria
document.getElementById('filtro-categoria').addEventListener('change', (e) => {
    carregarPedais(e.target.value);
});

// ADICIONAR PEDAL

const modalPedal = document.getElementById('modal-pedal');
const formPedal = document.getElementById('form-pedal');

document.getElementById('btn-abrir-modal').addEventListener('click', () => {
    formPedal.reset();
    modalPedal.showModal();
});

document.getElementById('btn-cancelar-modal').addEventListener('click', () => {
    modalPedal.close();
});

formPedal.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        categoria_id: parseInt(document.getElementById('categoria').value),
        imagem: document.getElementById('imagem').value || null,
    };

    const res = await fetch(`${BASE_URL}/pedais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (res.ok) {
        modalPedal.close();
        carregarPedais(document.getElementById('filtro-categoria').value);
    } else {
        const erro = await res.json();
        alert(erro.message || 'Erro ao adicionar pedal.');
    }
});

// EDITAR PEDAL

const modalEditar = document.getElementById('modal-editar');
const formEditar = document.getElementById('form-editar');

function abrirEditar(id, nome, descricao, categoriaId, imagem) {
    document.getElementById('editar-id').value = id;
    document.getElementById('editar-nome').value = nome;
    document.getElementById('editar-descricao').value = descricao;
    document.getElementById('editar-categoria').value = categoriaId;
    document.getElementById('editar-imagem').value = imagem;
    modalEditar.showModal();
}

document.getElementById('btn-cancelar-editar').addEventListener('click', () => {
    modalEditar.close();
});

formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editar-id').value;
    const body = {
        nome: document.getElementById('editar-nome').value,
        descricao: document.getElementById('editar-descricao').value,
        categoria_id: parseInt(document.getElementById('editar-categoria').value),
        imagem: document.getElementById('editar-imagem').value || null,
    };

    const res = await fetch(`${BASE_URL}/pedais/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (res.ok) {
        modalEditar.close();
        carregarPedais(document.getElementById('filtro-categoria').value);
    } else {
        const erro = await res.json();
        alert(erro.message || 'Erro ao editar pedal.');
    }
});

// DELETAR PEDAL

async function deletarPedal(id) {
    if (!confirm('Remover este pedal do catálogo?')) return;

    const res = await fetch(`${BASE_URL}/pedais/${id}`, { method: 'DELETE' });

    if (res.ok) {
        carregarPedais(document.getElementById('filtro-categoria').value);
    } else {
        const erro = await res.json();
        alert(erro.message || 'Erro ao remover pedal.');
    }
}

// INVENTÁRIO

async function carregarInventario() {
    const res = await fetch(`${BASE_URL}/inventario`);
    const dados = await res.json();
    renderizarInventario(dados.inventario);
}

function renderizarInventario(itens) {
    const lista = document.getElementById('lista-inventario');
    lista.innerHTML = '';

    if (itens.length === 0) {
        lista.innerHTML = '<p class="vazio">Seu inventário está vazio.</p>';
        return;
    }

    itens.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card-pedal';
        card.innerHTML = `
            ${item.pedal_imagem ? `<img src="${item.pedal_imagem}" alt="${item.pedal_nome}" onerror="this.style.display='none'">` : ''}
            <span class="categoria-tag">${item.categoria_nome || 'Sem categoria'}</span>
            <h3>${item.pedal_nome}</h3>
            <p>${item.pedal_descricao}</p>
            <div class="acoes">
                <button class="btn-perigo" onclick="removerDoInventario(${item.id})">Remover</button>
            </div>
        `;
        lista.appendChild(card);
    });
}

async function adicionarAoInventario(pedalId) {
    const res = await fetch(`${BASE_URL}/inventario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedal_id: pedalId }),
    });

    if (res.ok) {
        alert('Pedal adicionado ao inventário!');
    } else {
        const erro = await res.json();
        alert(erro.message || 'Erro ao adicionar ao inventário.');
    }
}

async function removerDoInventario(id) {
    if (!confirm('Remover este pedal do inventário?')) return;

    const res = await fetch(`${BASE_URL}/inventario/${id}`, { method: 'DELETE' });

    if (res.ok) {
        carregarInventario();
    } else {
        const erro = await res.json();
        alert(erro.message || 'Erro ao remover do inventário.');
    }
}

// INICIALIZAÇÃO

async function init() {
    await carregarCategorias();
    carregarPedais();
    mostrarSecao('catalogo');
}

init();
