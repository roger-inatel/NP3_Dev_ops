const request = require('supertest');

jest.mock('../src/database/connection', () => ({
  execute: jest.fn(),
}));

const pool = require('../src/database/connection');
const app = require('../src/app');

const mockBook = { id: 1, title: 'Dom Casmurro', author: 'Machado de Assis', available: 1 };
const mockReader = { id: 2, name: 'João Silva', email: 'joao@email.com' };
const mockLoan = { id: 10, book_id: 1, reader_id: 2, returned_at: null };

describe('Empréstimos', () => {
  beforeEach(() => {
    pool.execute.mockReset();
  });

  describe('POST /loans - Emprestar livro', () => {
    it('cria empréstimo com dados válidos e retorna 201', async () => {
      pool.execute
        .mockResolvedValueOnce([[mockBook]])        // findBookById
        .mockResolvedValueOnce([[mockReader]])      // findReaderById
        .mockResolvedValueOnce([[]])                // findActiveLoanByBookId (sem ativo)
        .mockResolvedValueOnce([{ insertId: 10 }]) // INSERT loan
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE book.available

      const res = await request(app)
        .post('/loans')
        .send({ book_id: 1, reader_id: 2 });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ id: 10, book_id: 1, reader_id: 2, returned_at: null });
    });

    it('retorna 400 quando book_id está ausente', async () => {
      const res = await request(app).post('/loans').send({ reader_id: 2 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/obrigatórios/i);
      expect(pool.execute).not.toHaveBeenCalled();
    });

    it('retorna 400 quando reader_id está ausente', async () => {
      const res = await request(app).post('/loans').send({ book_id: 1 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/obrigatórios/i);
      expect(pool.execute).not.toHaveBeenCalled();
    });

    it('retorna 400 quando body está vazio', async () => {
      const res = await request(app).post('/loans').send({});

      expect(res.status).toBe(400);
    });

    it('retorna 404 quando livro não existe', async () => {
      pool.execute.mockResolvedValueOnce([[]]); // findBookById → nenhum resultado

      const res = await request(app).post('/loans').send({ book_id: 99, reader_id: 2 });

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/Livro não encontrado/i);
    });

    it('retorna 404 quando leitor não existe', async () => {
      pool.execute
        .mockResolvedValueOnce([[mockBook]]) // findBookById
        .mockResolvedValueOnce([[]]); // findReaderById → nenhum resultado

      const res = await request(app).post('/loans').send({ book_id: 1, reader_id: 99 });

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/Leitor não encontrado/i);
    });

    it('retorna 400 quando livro já está emprestado', async () => {
      const loanAtivo = { id: 5, book_id: 1, reader_id: 3, returned_at: null };
      pool.execute
        .mockResolvedValueOnce([[mockBook]])   // findBookById
        .mockResolvedValueOnce([[mockReader]]) // findReaderById
        .mockResolvedValueOnce([[loanAtivo]]); // findActiveLoanByBookId → tem ativo

      const res = await request(app).post('/loans').send({ book_id: 1, reader_id: 2 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/já está emprestado/i);
    });

    it('retorna 500 quando banco de dados falha', async () => {
      pool.execute
        .mockResolvedValueOnce([[mockBook]])   // findBookById
        .mockResolvedValueOnce([[mockReader]]) // findReaderById
        .mockResolvedValueOnce([[]])           // findActiveLoanByBookId
        .mockRejectedValueOnce(new Error('Falha ao inserir empréstimo')); // INSERT

      const res = await request(app).post('/loans').send({ book_id: 1, reader_id: 2 });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /loans/:id/return - Devolver livro', () => {
    it('devolve livro com sucesso e retorna 200', async () => {
      pool.execute
        .mockResolvedValueOnce([[mockLoan]])          // findActiveLoanById
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // UPDATE loan.returned_at
        .mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE book.available

      const res = await request(app).post('/loans/10/return');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/devolvido/i);
    });

    it('retorna 404 quando empréstimo ativo não existe', async () => {
      pool.execute.mockResolvedValueOnce([[]]); // findActiveLoanById → nenhum resultado

      const res = await request(app).post('/loans/99/return');

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/não encontrado/i);
    });

    it('retorna 500 quando banco de dados falha', async () => {
      pool.execute.mockRejectedValueOnce(new Error('Timeout'));

      const res = await request(app).post('/loans/10/return');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /loans - Listar empréstimos', () => {
    it('lista todos os empréstimos e retorna 200', async () => {
      const loans = [
        { id: 1, book_id: 1, reader_id: 2, borrowed_at: '2025-01-01', returned_at: null },
        { id: 2, book_id: 3, reader_id: 4, borrowed_at: '2025-01-02', returned_at: '2025-01-05' },
      ];
      pool.execute.mockResolvedValueOnce([loans]);

      const res = await request(app).get('/loans');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('retorna lista vazia quando não há empréstimos', async () => {
      pool.execute.mockResolvedValueOnce([[]]);

      const res = await request(app).get('/loans');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('retorna 500 quando banco de dados falha', async () => {
      pool.execute.mockRejectedValueOnce(new Error('Erro de conexão'));

      const res = await request(app).get('/loans');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});
