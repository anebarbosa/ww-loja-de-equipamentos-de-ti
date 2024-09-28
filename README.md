[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

# **WW Loja de equipamentos de TI**
[Projeto desenvolvido por mim e utilizado para discussão do processo de criação de aplicações Web com Javascript para a disciplina de Autoração e Multimídia 2 do curso de Sistemas e Mídias Digitais da UFC.](https://wellingtonwfsarmento.notion.site/Criando-uma-aplica-o-Web-com-Javascript-98447010924b43768483289189ea1f92)

## **Desenvolvimento**
Implantarei a aplicação no Railway, pois para subir a aplicação do Firebase é necessário utilizar o Cloud Functions, que é pago.
Também não poderia ser implantado no hosting, uma vez que não é uma aplicação estática. 
Por hora estou exibindo imagens da aplicação em localhost.

### **Página Inicial**
A index chama a rota "/" que carrega as imagens do storage e produtos no firestore database que poderão ser adicionados ao carrinhos de compras.
![Index](https://github.com/anebarbosa/ww-loja-de-equipamentos-de-ti/assets/143014139/0ffb96e7-ac2f-4248-b679-8680962cb549)

### **Rodapé**
Ao rolar para baixo, vemos o rodapé.
![Footer](https://github.com/anebarbosa/ww-loja-de-equipamentos-de-ti/assets/143014139/3021900a-f3a3-47d1-ad67-3632fa8fbd78)

### **Login**
Ao clicar login ou tentar acessar a rota "/produtos" sem estar com sessão ativa, ele redireciona para a rota "/login".
![Login](https://github.com/anebarbosa/ww-loja-de-equipamentos-de-ti/assets/143014139/40efaf6b-0f78-4df0-a31a-a398592d416a)

### **Produtos**
Ao ser autenticado pelo authentication do firebase, ele autoriza o acesso da rota "/produtos".
![Produtos](https://github.com/anebarbosa/ww-loja-de-equipamentos-de-ti/assets/143014139/b78776c8-669a-4433-8f61-7021bf3fd085)

### **Cadastro**
A página de produtos lista os produtos e suas informações e contém um botão flutuante que abre um modal para cadastro de um novo produto, com o crud atualmente funcionando.
![Cadastro](https://github.com/anebarbosa/ww-loja-de-equipamentos-de-ti/assets/143014139/3548f076-47f0-4b7c-8393-e4d5c7639567)

TODO:
Correção de bug de login com Google;
Correção de bug do carrinho;
Rotas de atualização e deleção de produtos;
Implementação de filtro;
Fazer a aplicação funcionar em https://ww-loja-de-equipamentos-de-ti.web.app/
