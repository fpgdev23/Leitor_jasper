import { useState } from 'react';
import './App.css';
import { Search, Upload, FileArchive, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [fragmento, setFragmento] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    if (!arquivo || !fragmento) {
      setErro("Por favor, preencha o código e selecione um arquivo ZIP.");
      return;
    }

    setLoading(true);
    setErro(null);

    const formData = new FormData();
    formData.append('fragmento', fragmento);
    formData.append('arquivo_zip', arquivo);

    try {
      // URL DO RENDER AQUI (ou localhost para teste)
      const API_URL = 'https://leitor-jasper-api.onrender.com/buscar';

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData, // Não precisa de Content-Type headers com FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao processar busca');
      }

      // Converte a resposta em Download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `resultado_${fragmento}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1><Search style={{marginBottom: -5}} /> Buscador Jasper Web</h1>
      <p className="subtitle">Envie um ZIP com seus relatórios e encontre os arquivos pelo código.</p>

      <form onSubmit={handleBuscar}>

        <div className="form-group">
          <label>Código/Fragmento para buscar</label>
          <input
            type="text"
            placeholder="Ex: FPG_SIT_FUNCIONARIO..."
            value={fragmento}
            onChange={(e) => setFragmento(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Arquivo ZIP (Contendo os .jrxml e .jasper)</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".zip"
              id="zip-upload"
              onChange={handleFileChange}
              style={{display: 'none'}}
            />
            <label htmlFor="zip-upload" className="file-label">
              <Upload size={20} />
              {arquivo ? arquivo.name : "Clique para selecionar o ZIP"}
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className={loading ? 'loading-btn' : ''}>
          {loading ? (
            <><Loader2 className="spin" size={20}/> Processando...</>
          ) : (
            'Buscar e Baixar ZIP'
          )}
        </button>
      </form>

      {erro && (
        <div className="error-box">
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <AlertCircle size={20} /> <strong>Erro:</strong>
          </div>
          <p>{erro}</p>
        </div>
      )}
    </div>
  );
}

export default App;