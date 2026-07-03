# Valvulando — Frontend

Interface web do MVP Valvulando, uma SPA (Single Page Application) para gerenciar um catálogo de pedais de guitarra e um inventário pessoal.

Desenvolvido por **Pedro Martins Caires** como parte do projeto MVP do curso de Pós-Graduação em Desenvolvimento Full Stack da PUC-Rio.

---

## Sobre o projeto

O Valvulando permite ao usuário:

- Navegar pelo catálogo de pedais, filtrando por categoria
- Cadastrar, editar e remover pedais do catálogo
- Adicionar pedais ao inventário pessoal e removê-los quando quiser

A aplicação consome a [API Valvulando](https://github.com/pepemartins71/mvp-valvulando-backend) e foi construída com HTML, CSS e JavaScript puro, sem frameworks.

---

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)

---

## Como executar

### Pré-requisitos

- O backend deve estar rodando em `http://localhost:5000`. Consulte as instruções de execução no [repositório do backend](https://github.com/pepemartins71/mvp-valvulando-backend).

### Passos

1. Clone este repositório:
   ```
   git clone https://github.com/pepemartins71/mvp-valvulando-frontend
   ```

2. Acesse a pasta do projeto:
   ```
   cd mvp-valvulando-frontend
   ```

3. Abra o arquivo `index.html` diretamente no navegador (duplo clique no arquivo).

Não é necessário instalar dependências, configurar servidor local ou utilizar extensões.

---

## Estrutura de arquivos

```
mvp-valvulando-frontend/
├── index.html       # Estrutura da SPA
├── style.css        # Estilização e layout
├── script.js        # Lógica e consumo da API
├── imgs/            # Imagens locais
└── README.md
```

---

## Rotas da API consumidas

| Método | Rota | Ação na interface |
|--------|------|-------------------|
| GET | /categorias | Popula os filtros e selects de categoria |
| GET | /pedais | Carrega o catálogo de pedais |
| POST | /pedais | Formulário de cadastro de pedal |
| PUT | /pedais/{id} | Formulário de edição de pedal |
| DELETE | /pedais/{id} | Botão "Remover" no card do catálogo |
| GET | /inventario | Carrega o inventário pessoal |
| POST | /inventario | Botão "+ Inventário" no card do catálogo |
| DELETE | /inventario/{id} | Botão "Remover" no card do inventário |
