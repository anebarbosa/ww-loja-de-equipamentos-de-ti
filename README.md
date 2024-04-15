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
Como ainda não consegui subir a aplicação para o firebase, pois o hosting só usa index.html e não index.pug, estou exibindo imagens da aplicação em localhost.

### **Página Inicial**
A index chama a rota "/" que carrega as imagens do storage e produtos no firestore database que poderão ser adicionados ao carrinhos de compras.
![Index](https://drive.google.com/file/d/1NURts2GbDNnLsO-vt7DgostZ_6BSLkyb/view)

### **Rodapé**
Ao rolar para baixo, vemos o rodapé.
![Footer]((https://drive.google.com/file/d/1BQkIUTPhFGbw9-5uky1mckIZ2kJPoo3d/view))

### **Login**
Ao clicar login ou tentar acessar a rota "/produtos" sem estar com sessão ativa, ele redireciona para a rota "/login".
![Login](https://drive.google.com/file/d/10BDhiXDcA_eO6JpgG9n6CfXYwiwC14e1/view)

### **Produtos**
Ao ser autenticado pelo authentication do firebase, ele autoriza o acesso da rota "/produtos".
![Produtos](https://drive.google.com/file/d/1j6WKEHuHmxdWbdJ_YAPi8MOEjbx6p6RL/view)

### **Cadastro**
A página de produtos lista os produtos e suas informações e contém um botão flutuante que abre um modal para cadastro de um novo produto, com o crud atualmente funcionando.
![Cadastro](https://drive.google.com/file/d/11Bc1nq1gSIWuaWvb1YMAJtjlNOfVz1mf/view)

TODO:
Correção de bug de login com Google;
Correção de bug do carrinho;
Rotas de atualização e deleção de produtos;
Implementação de filtro;
Fazer a aplicação funcionar em https://ww-loja-de-equipamentos-de-ti.web.app/
