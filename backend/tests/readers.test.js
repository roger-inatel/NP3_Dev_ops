const request = require('supertest');

jest.mock('../src/database/connection', () => ({
  execute: jest.fn(),
}));

const pool = require('../src/database/connection');
const app = require('../src/app');

describe('Leitores', () => {
  beforeEach(() => {
    pool.execute.mockReset();
  });

  describe('POST /readers - Cadastro', () => {
    it('cria leitor com dados válidos e retorna 201', async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 3 }]);

      const res = await request(app)
        .post('/readers')
        .send({ name: 'Maria Silva', email: 'maria@email.com' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ id: 3, name: 'Maria Silva', email: 'maria@email.com' });
      expect(pool.execute).toHaveBeenCalledWith(
        'INSERT INTO readers (name, email) VALUES (?, ?)',
        ['Maria Silva', 'maria@email.com']
      );
    });

    it('retorna 400 quando name está ausente', async () => {
      const res = await request(app).post('/readers').send({ email: 'test@email.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/obrigatórios/i);
      expect(pool.execute).not.toHaveBeenCalled();
    });

    it('retorna 400 quando email está ausente', async () => {
      const res = await request(app).post('/readers').send({ name: 'Maria Silva' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/obrigatórios/i);
      expect(pool.execute).not.toHaveBeenCalled();
    });

    it('retorna 400 quando body está vazio', async () => {
      const res = await request(app).post('/readers').send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('retorna 500 quando banco de dados falha', async () => {
      pool.execute.mockRejectedValueOnce(new Error('Falha de conexão'));

      const res = await request(app)
        .post('/readers')
        .send({ name: 'Maria Silva', email: 'maria@email.com' });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /readers - Listagem', () => {
    it('lista todos os leitores cadastrados e retorna 200', async () => {
      const leitores = [
        { id: 1, name: 'João', email: 'joao@email.com' },
        { id: 2, name: 'Maria', email: 'maria@email.com' },
      ];
      pool.execute.mockResolvedValueOnce([leitores]);

      const res = await request(app).get('/readers');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe('João');
    });

    it('retorna lista vazia quando não há leitores', async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      const res = await request(app).get('/readers');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('retorna 500 quando banco de dados falha', async () => {
      pool.execute.mockRejectedValueOnce(new Error('Timeout'));

      const res = await request(app).get('/readers');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});
