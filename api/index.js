import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

// Configuração do dotenv (para encriptar os dados de acesso a base de dados)
dotenv.config();

// Ligação a base de dados MongoDb
mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log('Ligado a MongoDb com sucesso!');
	})
	.catch(err => {
		console.log('Não foi possivel ligar a MongoDb!', err);
	});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
	console.log('O servidor esta a correr na porta 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'cliente', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Erro interno do servidor';
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
