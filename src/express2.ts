import express from 'express';

let app = express();

app.use(express.json());

class Growdever {
   constructor(public id: number, public nome: string, public idade: number, public turma: number, public tecnologias: string[] = [], public cidade: string) {
      this.id = id;
      this.nome = nome;
      this.idade = idade;
      this.turma = turma;
      this.tecnologias = tecnologias;
      this.cidade = cidade;
   }
}

let growdevers: Growdever[] = [];

let id = 0;
app.post('/novo', (req, res) => {
   let { nome, idade, turma, tecnologias, cidade } = req.body;
   if (!nome) {
      res.status(418).send('Preencha o nome!');
   }
   let novo: Growdever = new Growdever(id, nome as string, parseInt(idade as string), parseInt(turma as string), tecnologias, cidade);
   growdevers.push(novo);
   id++;
   res.send(novo);
});

app.get('/novo', (req, res) => {});

app.listen(8080, () => {
   console.log('server iniciou');
});
