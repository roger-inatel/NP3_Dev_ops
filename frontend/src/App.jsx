function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">Sistema de Biblioteca Simples</p>
        <h1>Biblioteca NP3</h1>
        <p>
          Frontend inicial preparado para evoluir com cadastro de livros,
          leitores, emprestimos e devolucoes.
        </p>
        <dl>
          <div>
            <dt>API planejada</dt>
            <dd>{apiUrl}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Estrutura inicial criada</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

export default App;
