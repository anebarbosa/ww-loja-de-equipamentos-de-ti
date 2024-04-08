import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import multer from 'multer';
import admin from 'firebase-admin';
import session from 'express-session';
import express from 'express';

config();

const app = express();

const port = process.env.PORT || 3000; //Escolha um valor que esteja entre 1025 e 65535 no .env


// Configuração do Firebase
const firebaseConfig = {
    // Insira suas credenciais do Firebase aqui
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
const firebase = initializeApp(firebaseConfig);

// Configuração do Firebase Admin
const serviceAccount = JSON.parse(readFileSync(process.env.SERVICE_ACCOUNT_KEY_PATH));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Use the upload middleware for file uploads
app.use(upload.single('imagem')); // 'imagem' should match the name attribute of your file input field

// Get a reference to Firebase Storage
const storageRef = getStorage(firebase);


// Configurações do Express
app.set('view engine', 'pug');
app.set('views', './views');


//Recursos estáticos da aplicação
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));



// Rota principal
app.get('/',(req,res)=>{
    res.render('index');
});


//Rota de tela para autenticação
app.get('/login',(req, res)=>{ 
    res.render('login');
});   


// Rota para autenticação
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const auth = getAuth(firebase);
    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            // Autenticação bem-sucedida
            req.session.user = userCredential.user;
            res.redirect('/produtos');
        })
        .catch((error) => {
            // Tratamento de erro
            res.render('login', { error: error.message });
        });
});


// Rota para exibir a lista de produtos
app.get('/produtos', (req, res) => {
    // Verifica se o usuário está autenticado
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }
    // Aqui você pode buscar os produtos do Firestore e renderizar a página de produtos
    res.render('produtos');
});


// Rota para o formulário de cadastro de produtos
app.get('/cadastro-produtos', (req, res) => {
    res.render('cadastro');
});


// Rota para lidar com o envio do formulário de cadastro de produtos
app.post('/cadastro-produtos', async (req, res) => {
    const { nomeProduto, descricao, preco } = req.body;
    // Acessa o arquivo enviado
    const imagem = req.file;
    if (!imagem) {
        return res.status(400).send('Nenhuma imagem selecionada');
    }
    // Nome do arquivo no Firebase Storage
    const fileName = `${Date.now()}_${imagem.originalname}`;
    // Referência ao arquivo no Firebase Storage
    const fileRef = ref(storageRef, fileName);

    try {
        // Upload do arquivo para o Firebase Storage
        await uploadBytes(fileRef, imagem.buffer);

        // Objeto do produto para inserção no Firestore
        const produto = {
            nome: nomeProduto,
            descricao: descricao,
            preco: parseFloat(preco), // Garantir que o preço é armazenado como um número
            imageUrl: `https://storage.googleapis.com/${storage.bucket}/${fileName}` // URL para acessar a imagem enviada
        };

        // Inserir o produto no Firestore
        await db.collection('produtos').add(produto);
        
        console.log('Produto adicionado com sucesso!');
        res.redirect('/produtos'); // Redirecionar para a lista de produtos após a inserção
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.render('cadastro', { error: error.message });
    }
});



// Rota para logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});