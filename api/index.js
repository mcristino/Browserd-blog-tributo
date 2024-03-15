import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';


// Configuração do dotenv (para encriptar os dados de acesso a base de dados)
dotenv.config();

// Ligação a base de dados MongoDb
mongoose.connect(
    process.env.MONGO)
    .then(() => {
		console.log('Ligado a MongoDb com sucesso!');
	})
    .catch((err) => {
        console.log('Não foi possivel ligar a MongoDb!', err);
    })

const app = express();

app.listen(3000, () => {
	console.log('O servidor esta a correr na porta 3000!');
});


app.use('/api/user', userRoutes);
