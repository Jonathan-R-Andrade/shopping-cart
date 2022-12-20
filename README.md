# Shopping Cart

Clique [aqui](https://jonathan-r-andrade.github.io/shopping-cart) para ver o projeto no navegador.

## Sobre

Projeto desenvolvido por [Jonathan R. Andrade](https://www.linkedin.com/in/jonathan-r-andrade/) na [Trybe](https://www.betrybe.com/).

Nesse projeto eu desenvolvi um carrinho de compras dinâmico consumindo dados da API do Mercado Livre. É possível pesquisar por produtos e adicioná-los no carrinho, também dá para removê-los individualmente ou todos limpando o carrinho.

Eu também implementei testes unitários usando Jest para verificar se as requisições à API e a chamada das funções do armazenamento local (localStorage) estão sendo feitas corretamente.

## Habilidades desenvolvidas

* Fazer requisições a uma API (Application Programming Interface) do Mercado Livre;
* Utilizar os conhecimentos sobre JavaScript, CSS e HTML;
* Trabalhar com funções assíncronas;
* Implementar testes unitários.

## Ferramentas utilizadas

* HTML5
* CSS3
* JavaScript ES6+
* Jest
* Node.js v14

## Como executar

Siga os passos abaixo executando os comandos no terminal.

1. Clone o repositório.

    * Exemplo com Git + HTTPS
      ```
      git clone https://github.com/Jonathan-R-Andrade/shopping-cart.git
      ```
    * Exemplo com Git + SSH
      ```
      git clone git@github.com:Jonathan-R-Andrade/shopping-cart.git
      ```
    * Usando GitHub CLI
      ```
      gh repo clone Jonathan-R-Andrade/shopping-cart
      ```

    > Entre na pasta do repositório clonado.

2. Instale as dependências:
    ```
    npm install
    ```

---

### Executando a aplicação

Entre na pasta `src` e abra o arquivo `index.html` no navegador.

---

### Executando os testes

* Execute todos os testes: 
    ```
    npm test
    ```
* Execute o teste de cobertura: 
    ```
    npm run test:coverage
    ```
    > Será testada a cobertura das funções na pasta `src/js/helpers`.

---

### Executando os linters

Para garantir a qualidade do código os linters **ESLint** e **StyleLint** foram utilizados, para rodá-los, execute os comandos abaixo:

* Para rodar o ESLint:
    ```
    npm run lint
    ```
* Para rodar o StyleLint:
    ```
    npm run lint:styles
    ```
