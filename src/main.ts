import express from 'express';

let app = express();
app.use(express.json());

app.get('/', (req, res) => {
   console.log('Acessou!');
   res.send('Acessou a API!');
});

app.get('/users/:id', (req, res) => {
   let users = ['teste', 'nome', 'terceiro'];

   let id = req.params.id;
   let user = users[parseInt(id)];

   if (!user) {
      return res.status(404).send({
         ok: false,
         mensagem: 'Não encontrei usuario',
         code: 404,
      });
   }

   res.send({
      dados: users,
      ok: true,
   });
});

app.get('/players', (req, res) => {
   //let nome = req.query.nome;
   //let id = req.query.id;

   let { nome, id } = req.query;

   res.send({
      nome,
      id,
   });
});

app.post('/player', (req, res) => {
   let { nome, password } = req.body;

   res.send({
      mensagem: 'Usuario criado',
      dados: {
         nome,
         password,
      },
   });
});

app.listen(8081, () => {
   console.log('servidor iniciou...');
});
