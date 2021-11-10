import express from 'express';

let app = express();
app.use(express.json());

app.get('/calculadora/:operacao', (req, res) => {
   let { valorA, valorB } = req.query;
   let vA = parseInt(valorA as string);
   let vB = parseInt(valorB as string);
   let operacao = req.params.operacao;

   if (operacao == 'somar') {
      //   return res.send(`${vA + vB}`);
      return res.send({
         soma: vA + vB,
      });
   }
   if (operacao == 'subtrair') {
      return res.send(`${vA - vB}`);
   }
   if (operacao == 'multiplicar') {
      return res.send(`${vA * vB}`);
   }
   if (operacao == 'dividir') {
      return res.send(`${vA / vB}`);
   }
});

let contador = 0;
app.get('/contador', (req, res) => {
   if (contador > 10) {
      contador = 0;
      res.send('Cheguei ao fim! :D');
   } else res.send(`${contador}`);
   contador++;
});

app.get('/numeral/:numero', (req, res) => {
   let { onde } = req.query;
   let numero = parseInt(req.params.numero);
   if (onde == 'anterior') {
      return res.send(`${numero - 1}`);
   } else if (onde == 'proximo') {
      return res.send(`${numero + 1}`);
   }
});

app.get('/inverter-string', (req, res) => {
   let { valor } = req.query;
   let v = valor as string;
   return res.send(v.split('').reverse().join(''));
});

let array: string[] = [];
app.get('/remover-vogais', (req, res) => {
   let { valor } = req.query;
   let v = valor as string;
   v.replace(/[aeiouà-ú]/gi, '');
   array.push(v);
   res.send(`${array}`);
});

class Pessoa {
   constructor(public id: number, public nome: string, public idade: number, public cpf?: number) {
      this.id = id;
      this.nome = nome;
      this.idade = idade;
      this.cpf = cpf;
   }
   inverterNome() {
      return this.nome.split('').reverse().join('');
   }
}

let pessoas: Pessoa[] = [];
let id = 1;
app.get('/adicionar-pessoa', (req, res) => {
   let { nome, idade } = req.query;
   let novaPessoa: Pessoa = new Pessoa(id, nome as string, parseInt(idade as string));
   pessoas.push(novaPessoa);
   id++;
});

app.get('/exibir-pessoa/:id', (req, res) => {
   let id = parseInt(req.params.id);
   for (let pessoa of pessoas) {
      if (pessoa.id == id) {
         return res.send(pessoa);
      }
   }
});

app.get('/exibir-pessoas', (req, res) => {
   res.send(pessoas);
});

app.get('/remover-pessoa/:id', (req, res) => {
   let id = parseInt(req.params.id);
   pessoas = pessoas.filter((pessoa) => pessoa.id != id);
});

app.get('/inverter-nomes-pessoas', (req, res) => {
   let nomesInvertidos = [];
   for (let pessoa of pessoas) {
      nomesInvertidos.push(pessoa.inverterNome());
   }
   res.send(nomesInvertidos);
});

app.post('/adicionar-pessoa', (req, res) => {
   let { nome, cpf, idade } = req.query;
   for (let pessoa of pessoas) {
      if (pessoa.cpf == cpf || pessoa.id == id) {
         res.send('Dados invalidos, cpf ou id já existentes.');
      }
   }
   let novaPessoa: Pessoa = new Pessoa(id, nome as string, parseInt(idade as string), parseInt(cpf as string));
   pessoas.push(novaPessoa);
   id++;
   res.send(novaPessoa);
});

let alfabeto = 'abcdefghijklmnopqrstuvwxyz';

app.post('/adicionar-time/', (req, res) => {
   // declara requisições que vai receber
   // let { ano, estado, nome } = req.body; // assim é mais prático, o lado negativo é que o type não reconhece qual tipo de cada variavel e trata como any ou unknown
   let estado: string = req.body.estado;
   let ano: number = req.body.ano;
   let nome: string = req.body.nome;

   // testa se existem
   if (!nome) {
      res.status(406).send({
         mensagem: 'Informe um nome',
      });
   } else if (!ano) {
      res.status(406).send({
         mensagem: 'Informe um ano',
      });
   } else if (!estado) {
      res.status(406).send({
         mensagem: 'Informe um estado',
      });
   }

   // transforma o nome e o alfabeto em array
   let arrayDeLetras = Array.from(alfabeto);
   let nomeEmArray = Array.from(nome);

   // soma do ano = chave
   let code = Array.from(ano.toString())
      .map(Number)
      .reduce((x, y) => x + y);

   // troca das letras pela chave
   let index = 0;
   for (const letraDoNome of nomeEmArray) {
      let indexLetraNoArray = arrayDeLetras.findIndex((letra) => letra == letraDoNome);
      let modificador = 0;
      while (indexLetraNoArray + code - modificador >= 26) {
         modificador += 26;
      }
      let novoIndex = indexLetraNoArray + code - modificador;
      let novaLetra = arrayDeLetras[novoIndex];
      nomeEmArray[index] = novaLetra;
      index++;
   }
   let nomeInvertido = nomeEmArray.join('');

   // troca das letras do alfabeto pela chave
   let arrayInvertido = alfabeto.split('');
   let indexLetraNoArray2 = 0;
   for (const letra of arrayInvertido) {
      let modificador = 0;
      while (indexLetraNoArray2 + code - modificador >= 26) {
         modificador += 26;
      }
      let novoIndex = indexLetraNoArray2 + code - modificador;
      arrayInvertido[indexLetraNoArray2] = arrayDeLetras[novoIndex];
      indexLetraNoArray2++;
   }

   // res
   res.status(200).send({
      mensagem: 'ok',
      resposta: nomeInvertido.toUpperCase(),
      dados: {
         nomeDoTime: nome,
         estado: estado,
         ano: ano,
         chave: code,
         original: alfabeto,
         decifrado: arrayInvertido.join(''),
      },
   });
});

let boxValores: number[] = [];
app.post('/adicionar-valores-calculo/', (req, res) => {
   let valor: number = JSON.parse(req.body.valor);
   let valorString: string[] = Array.from(valor.toString()); // ["2", "0", "5"]
   for (const numero of valorString) {
      if (numero == '2' || numero == '4') {
         return res.status(200).send({
            mensagem: 'numero possui 2 ou 4 e não foi inserido.',
            boxValores: boxValores,
            dados: {
               valorInformado: valor,
            },
         });
      }
   }
   boxValores.push(valor);
   let soma: number = boxValores.reduce((x, y) => x + y);

   let somaEmArray: number[] = [];
   for (let x = soma; x > 0; x--) {
      if (x == 0) {
         console.log(`soma é ${x}`);
         break;
      }
      somaEmArray.unshift(x);
   }

   let impares: number[] = [];
   for (let x = 0; x <= somaEmArray.length; x++) {
      if (x % 2) {
         impares.push(x);
      }
   }
   let quantImpares: number = impares.length;

   let pares: number[] = [];
   for (let x = 1; x <= somaEmArray.length; x++) {
      if (x % 2 == 0) {
         pares.push(x);
      }
   }
   let quantPares: number = pares.length;

   res.status(201).send({
      mensagem: 'ok',
      boxValores: boxValores,
      dados: {
         valorInformado: valor,
         somaValor: soma,
         somaEmArray: somaEmArray,
         quantidaDePares: quantPares,
         listaDePares: pares,
         quantidaDeImpares: quantImpares,
         listaDeImpares: impares,
      },
   });
});

interface Ientrada {
   usuarioId: string;
   milhas: number | string;
   data: string;
}

let boxClientes: Ientrada[] = [];

app.post('/cadastrar-milhas/', (req, res) => {
   let usuarioId: string = req.body.usuarioId;
   let milhas = req.body.milhas;
   let data = req.body.data as string;

   let testeGeral = (usuarioId: string, milhas: any, data: string) => {
      // checa usuario presente
      if (!usuarioId) {
         return res.status(406).send({
            mensagem: 'Insira um usuarioId',
            dados: {
               usuarioId,
               milhas,
               data,
               boxClientes,
            },
         });
      } // checa milhas presente
      else if (!milhas) {
         return res.status(406).send({
            mensagem: 'Insira um milhas',
            dados: {
               usuarioId,
               milhas,
               data,
               boxClientes,
            },
         });
      } // checa milhas é um numero
      else if (isNaN(milhas)) {
         return res.status(418).send({
            mensagem: 'milha is not a number',
            dados: {
               usuarioId,
               milhas,
               data,
               boxClientes,
            },
         });
      } // checa data presente
      else if (!data) {
         return res.status(406).send({
            mensagem: 'Insira um data',
            dados: {
               usuarioId,
               milhas,
               data,
               boxClientes,
            },
         });
      } // checa formato data
      else if (Array.from(data)[2] != '/' || Array.from(data)[5] != '/' || data.length < 10) {
         // .match(/\S+/\S+/\S/) ?
         return res.status(406).send({
            mensagem: 'Insira a data no formato correto',
            formatoCorreto: 'dia/mes/anoCompletos',
            dados: {
               usuarioId,
               milhas,
               data,
               boxClientes,
            },
         });
      }
   };
   let informaResgate = () => {
      for (const cliente of boxClientes) {
         if (cliente.usuarioId == usuarioId) {
            if (Number(cliente.milhas) % 120000 == 0 && Number(cliente.milhas) !== 0) {
               return `Você pode resgatar milhas`;
            }
         }
      }
   };
   let condiciona = () => {
      if (Number(data.slice(6, 10)) !== 2020) {
         return 0;
      } else {
         return Number(milhas);
      }
   };

   testeGeral(usuarioId, milhas, data);

   for (const cliente of boxClientes) {
      if (cliente.usuarioId == usuarioId) {
         cliente.milhas = (Number(condiciona()) + Number(cliente.milhas)).toString();
         return res.status(200).send({
            mensagem: `adicionado ${condiciona()} milhas ao cliente Id ${cliente.usuarioId}. Total de milhas: ${cliente.milhas}`,
            dados: {
               usuarioId,
               milhas,
               data,
            },
            extras: {
               boxClientes,
            },
            resgate: informaResgate(),
         });
      }
   }

   boxClientes.push({
      usuarioId: usuarioId,
      milhas: String(condiciona()),
      data: data,
   });

   res.status(201).send({
      mensagem: `Sucesso, novo usuário Id ${usuarioId} criado. Você possui ${milhas} milhas.`,
      dados: {
         usuarioId,
         milhas,
         data,
      },
      extras: {
         boxClientes,
      },
   });
});

app.post('/cadastrar-tentativas/', (req, res) => {
   let { numeroTentativas, numeroAcertos } = req.body;
   let porcentagem = Math.floor((Number(numeroAcertos) / Number(numeroTentativas)) * 100);

   if (isNaN(numeroAcertos) || isNaN(numeroTentativas)) {
      res.status(400).send({ mensagem: `O número de acertos e o número de tentativas precisam ser um número` });
   } else if (numeroAcertos > numeroTentativas) {
      res.status(400).send({ mensagem: `O número de acertos não pode ser maior que o número de tentativas` });
   } else if (porcentagem >= 0 && porcentagem <= 40) {
      res.status(200).send({
         mensagem: `Você precisa melhorar.`,
         porcentagem: porcentagem,
      });
   } else if (porcentagem > 40 && porcentagem <= 60) {
      res.status(200).send({
         mensagem: `Muito bom, mas ainda pode ser melhor.`,
         porcentagem: porcentagem,
      });
   } else if (porcentagem > 60 && porcentagem <= 90) {
      res.status(200).send({
         mensagem: `Parabéns, seu aproveitamento é acima da média.`,
         porcentagem: porcentagem,
      });
   } else if (porcentagem > 90 && porcentagem <= 99) {
      res.status(200).send({
         mensagem: `Parabéns, você está entre os melhores.`,
         porcentagem: porcentagem,
      });
   } else if (porcentagem > 99) {
      res.status(200).send({
         mensagem: `Parabéns, você é O MELHOR.`,
         porcentagem: porcentagem,
      });
   } else if (porcentagem < 0) {
      res.status(405).send({ mensagem: `Você não pode ser tão ruim` });
   } else {
      res.status(418).send(`ERROR: DEU ERRADO`);
   }
});

// inicializador do servidor
app.listen(3333, () => {
   console.log('servidor iniciou...');
});
