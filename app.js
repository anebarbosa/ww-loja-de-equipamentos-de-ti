import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import admin from 'firebase-admin';
import session from 'express-session';
import express from 'express';

config();

const app = express();
const displayHost = process.env.HOST || 'localhost';
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

// Configuração do Google Auth
const googleConfig = {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleDiscoveryUrl: process.env.GOOGLE_DISCOVERY_URL,
};

const firebase = initializeApp(firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

const auth = getAuth(firebase);
auth.languageCode = 'it';
auth.useDeviceLanguage();

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.setCustomParameters({'login_hint': 'user@example.com'});

const oauth2Client = new OAuth2Client()

app.use(upload.single('imagem'));


// Configuração do Firebase Admin
//const serviceAccount = JSON.parse(readFileSync(process.env.SERVICE_ACCOUNT_KEY_PATH));
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


// Configurações do Express
app.set('view engine', 'pug');
app.set('views', './views');


//Recursos estáticos da aplicação
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});


// Rota principal
app.get('/', async (req, res) => {
    try {
        // Calculate the total number of items in the cart
        const cartItemCount = req.session.cart ? req.session.cart.length : 0;

        // Your existing code to fetch products from the database
        const produtosSnapshot = await db.collection('produtos').get();
        const produtos = [];

        produtosSnapshot.forEach(doc => {
            produtos.push(doc.data());
        });

        // Pass cartItems along with other data to the layout template
        res.render('index', { 
            produtos: produtos, 
            session: req.session.user, 
            cartItemCount: cartItemCount,
            cartItems: req.session.cart || [] // Ensure cartItems is not undefined
        });
    } catch (error) {
        console.error('Erro ao recuperar produtos:', error);
        res.render('index', { error: error.message, session: req.session.user });
    }
});


//Rota de tela para autenticação
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('login', { session: req.session.user });
}); 


// Rotas para autenticação
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
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

app.get('/auth/google', (req, res) => {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&response_type=code&scope=email%20profile&redirect_uri=${process.env.REDIRECT_URI}`;
    res.redirect(redirectUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oAuth2Client.getToken(code);
        const credential = GoogleAuthProvider.credentialFromJSON(tokens);
        const userCredential = await signInWithCredential(auth, credential);
        
        req.session.token = tokens;
        req.session.user = userCredential.user;
        res.redirect('/produtos');
    } catch (error) {
        res.render('login', { error: error.message });
    }
});


// Rota para exibir a lista de produtos
app.get('/produtos', async (req, res) => {
    try {
        // Verifica se o usuário está autenticado
        if (!req.session.user) {
            res.redirect('/login');
            return;
        }

        const produtosSnapshot = await db.collection('produtos').get();
        const produtos = [];

        produtosSnapshot.forEach(doc => {
            produtos.push(doc.data());
        });

        res.render('produtos', { produtos: produtos, session: req.session.user });
    } catch (error) {
        console.error('Erro ao recuperar produtos:', error);
        res.render('produtos', { error: error.message, session: req.session.user });
    }
});


// Rota para o formulário de cadastro de produtos
//app.get('/cadastro-produtos', (req, res) => {
//    res.render('cadastro');
//});


// Rota para lidar com o envio do formulário de cadastro de produtos
app.post('/cadastro-produtos', async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/login');
            return;
        }
        const { nomeProduto, descricao, preco } = req.body;
        // Acessa o arquivo enviado
        const imagem = req.file;
        if (!imagem) {
            return res.status(400).send('Nenhuma imagem selecionada');
        }
        // Nome do arquivo no Firebase Storage
        const fileName = `${Date.now()}_${imagem.originalname}`;
        // Referência ao arquivo no Firebase Storage
        const fileRef = ref(storage, fileName);

        // Upload do arquivo para o Firebase Storage
        const snapshot = await uploadBytesResumable(fileRef, imagem.buffer);

        const downloadURL = await getDownloadURL(snapshot.ref);

        // Objeto do produto para inserção no Firestore
        const produto = {
            nome: nomeProduto,
            descricao: descricao,
            preco: parseFloat(preco), // Garantir que o preço é armazenado como um número
            imageUrl: downloadURL // URL para acessar a imagem enviada
        };

        // Inserir o produto no Firestore
        await db.collection('produtos').add(produto);
        
        console.log('Produto adicionado com sucesso!');
        req.session.toast = { type: 'success', message: 'Produto adicionado com sucesso!' };
        res.status(201).redirect('/produtos');
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        req.session.toast = { type: 'error', message: 'Erro ao adicionar produto: ' + error.message };
        res.status(500).redirect('/produtos');
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
    console.log(`Servidor rodando em http://${displayHost}:${port}`);
});