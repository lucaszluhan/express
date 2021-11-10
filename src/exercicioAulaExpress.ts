import express from 'express';
import routes from './exercicioAulaRoutes';

let app = express();
app.use(express.json);

app.use(routes);

app.listen(8082, () => {
   console.log('iniciado');
});
