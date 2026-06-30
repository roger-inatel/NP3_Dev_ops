const request = require('supertest');

jest.mock('../src/database/connection', () => ({
  execute: jest.fn(),
}));

const pool = require('../src/database/connection');
const app = require('../src/app');

describe('Livros', () => {
  beforeEach(() => {
    pool.execute.mockReset();
  });

  describe('POST /books - Cadastro', () => {
    it('cria livro com dados válidos e retorna 201', async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 7 }]);

      const res = await request(app)
        .post('/books')
        .send({ title: 'Dom Casmurro', author: 'Machado de Assis' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 7,
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        available: true,
      });
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO books (title, author) VALUES (?, ?)',
        ['Dom Casmurro', 'Machado de Assis']
      );
    });

    it('retorna 400 quando title está ausente', async () => {
      const res = await request(app)
        .post('/books')
        .send({ author: 'Machado de Assis' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/obrigatórios/i);
      expect(pool.execute).not.toHaveBeenCalled();
    });

    it('retorna 400 quando author está ausente', async () => {
      const res = await request(app)
        .post('/books')
        .send({ title: 'Dom Casmurro' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/obrigatórios/i);
      expect(pool.execute).not.toHaveBeenCalled();
    });

    it('retorna 400 quando body está vazio', async () => {
      const res = await request(app).post('/books').send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('retorna 500 quando banco de dados falha', async () => {
      pool.execute.mockRejectedValueOnce(new Error('Conexão recusada'));

      const res = await request(app)
        .post('/books')
        .send({ title: 'Dom Casmurro', author: 'Machado de Assis' });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /books - Listagem', () => {
    it('lista todos os livros cadastrados e retorna 200', async () => {
      const livros = [
        { id: 1, title: 'Dom Casmurro', author: 'Machado de Assis', available: 1 },
        { id: 2, title: 'O Cortiço', author: 'Aluísio Azevedo', available: 0 },
      ];
      pool.execute.mockResolvedValueOnce([livros]);

      const res = await request(app).get('/books');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Dom Casmurro');
    });

    it('retorna lista vazia quando não há livros cadastrados', async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      const res = await request(app).get('/books');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('retorna 500 quando banco de dados falha', async () => {
      pool.execute.mockRejectedValueOnce(new Error('Timeout no banco'));

      const res = await request(app).get('/books');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});
