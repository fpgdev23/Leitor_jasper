import { useState } from 'react';
import './App.css';
import { Search, FolderCheck, AlertCircle, FileCode } from 'lucide-react';
import  footer from './componets/footer';

function App() {

  const [fragmento, setFragmento] = useState('');
  const [origem, setOrigem] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault(); // Não recarrega a página
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {

      const response = await fetch('https://leitor-jasper-api.onrender.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigofragmento: fragmento,
      caminhoorigem: origem,
      caminhodestino: destino
    })
});

      const data = await response.json();

      if (!response.ok) {

        throw new Error(data.detail || 'Erro desconhecido na API');
      }

      setResultado(data);

    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1><Search style={{marginBottom: -5}} /> Buscador Jasper</h1>

      <form onSubmit={handleBuscar}>
        <div className="form-group">
          <label>Código  para buscar</label>
          <input
            type="text"
            placeholder="Ex: 2a5985c3-5dce..."
            value={fragmento}
            onChange={(e) => setFragmento(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Pasta de Origem (Onde estão os arquivos)</label>
          <input
            type="text"
            placeholder="C:\Users\Documentos\Inputs"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            required
          />
          <small style={{color: '#6b7280', fontSize: '0.8rem'}}>
            Pode colar o caminho direto do Windows.
          </small>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Procurando...' : 'Buscar Arquivos'}
        </button>
      </form>

      {/* Exibição de Erros */}
      {erro && (
        <div className="error-box">
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold'}}>
            <AlertCircle size={20} /> Erro
          </div>
          <p>{erro}</p>
        </div>
      )}

      {/* Exibição de Resultados */}
      {resultado && (
        <div className="result-box">
          <h3 style={{marginTop: 0, color: '#166534', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <FolderCheck /> Sucesso!
          </h3>

          <p><strong>Pasta criada:</strong> {resultado.pasta_criada}</p>
          <p><strong>Arquivos copiados:</strong> <span className="badge">{resultado.quantidade_copiada}</span></p>

          {resultado.arquivos_jasper_copiados.length > 0 && (
            <div style={{marginTop: '1rem'}}>
              <h4>Arquivos encontrados:</h4>
              <ul>
                {resultado.arquivos_jasper_copiados.map((arq, index) => (
                  <li key={index}>
                    <FileCode size={16} color="#2563eb"/> {arq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultado.quantidade_copiada === 0 && (
            <p style={{color: '#b45309'}}>Nenhum arquivo encontrado com esse código.</p>
          )}
        </div>
      )}
    </div>
  );
}
<footer>

</footer>
export default App;