import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

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

const app = express();

app.use(express.json());

app.listen(3000, () => {
	console.log('O servidor esta a correr na porta 3000!');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Erro interno do servidor';
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
