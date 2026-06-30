require('dotenv').config();
const express = require('express');
const initDatabase = require('./database/init');
const bookRoutes = require('./routes/bookRoutes');
const readerRoutes = require('./routes/readerRoutes');

const app = express();

app.use(express.json());

app.use('/books', bookRoutes);
app.use('/readers', readerRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'biblioteca-backend',
  });
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;

  initDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`Backend da biblioteca rodando na porta ${port}`);
      });
    })
    .catch((err) => {
      console.error('Erro ao inicializar banco de dados:', err);
      process.exit(1);
    });
}
