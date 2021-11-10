import express from 'express';
import { User, users, Transaction } from './exercicioAulaUser';

let routes = express.Router();

routes.get('users', (req, res) => {
   if (users == []) {
      return res.status(204).send({
         message: 'Nenhum usuario encontrado!',
      });
   }
   res.send({ message: 'Estes sao os usuarios encontrados.', users });
});

routes.post('users', (req, res) => {
   let { name, cpf, email, age } = req.body;
   let newUser: User = new User(name, cpf, email, age);
   users.push(newUser);
   res.send({ message: 'Usuario criado com sucesso.' });
});

export default routes;
