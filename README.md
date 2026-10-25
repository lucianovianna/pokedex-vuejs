# Pokédex com Vue.js

Uma Pokédex feita com Vue.js e dados da [PokéAPI](https://pokeapi.co/), com busca,
ordenação, paginação e uma página de detalhes de cada Pokémon.

Criei este projeto há alguns anos, durante um desafio técnico na empresa em que
trabalho, quando ainda era dev júnior. Hoje sou dev sênior e estou revisitando o
código para fazer pequenas melhorias, mantendo a essência do projeto original.

## Funcionalidades

- Busca de Pokémon por nome.
- Ordenação por ID ou nome, em ordem crescente ou decrescente.
- Listagem paginada com imagens e tipos.
- Página de detalhes com altura, peso, tipos e habilidades.
- Gráfico de atributos e navegação entre Pokémon da cadeia de evolução.

## Tecnologias

- Vue.js 2 e Vue Router 3.
- Axios para as requisições à PokéAPI.
- Bootstrap 4, BootstrapVue e SCSS para a interface.
- Chart.js 2 e vue-chartjs 3 para o gráfico.
- Vue CLI 4 para desenvolvimento e build.

## Como executar

Você precisa de **Node.js 16**, npm e acesso à internet para consultar a PokéAPI.
Não é necessário configurar backend, banco de dados ou chave de API.

O projeto foi executado com Node.js 16. Se você usa nvm, selecione essa versão
antes de instalar as dependências:

```bash
nvm install
nvm use
```

Instale as dependências a partir do lockfile:

```bash
npm ci
```

Inicie o servidor de desenvolvimento e abra o endereço exibido no terminal:

```bash
npm run serve
```

Para gerar a versão de produção na pasta `dist/`:

```bash
npm run build
```

Para verificar o código sem aplicar correções automáticas:

```bash
npm run lint -- --no-fix
```

O comando `npm run lint`, sem `--no-fix`, também aplica correções automáticas.
Para executar os testes de regressão de busca, ordenação, paginação, dados e
falhas da API, sem consultar a PokéAPI ao vivo:

```bash
npm test
```

Os testes usam o Node.js e as ferramentas de compilação já incluídas no projeto.

## Estrutura

```text
src/
├── components/  # Componentes de interface e gráfico
├── router/      # Rotas da aplicação
├── scss/        # Personalização dos estilos
├── services/    # Requisições à PokéAPI
├── views/       # Telas de listagem e detalhes
├── App.vue      # Estrutura principal da aplicação
└── main.js      # Inicialização, plugins e filtros
```

## Sobre as melhorias

A ideia é corrigir bugs, melhorar o tratamento de erros, a acessibilidade e a
clareza do código, com mudanças pequenas e fáceis de entender. A estrutura
original continua sendo o ponto de partida.

As orientações para trabalhar no repositório com assistentes de IA estão em
[AGENTS.md](AGENTS.md).

## Licença

Este projeto está disponível sob a [licença MIT](LICENSE).
