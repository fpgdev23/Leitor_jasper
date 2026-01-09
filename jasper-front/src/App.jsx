import { useState } from 'react';
import './App.css';
import { UploadCloud, FileDown, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Função para enviar o arquivo
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setErro(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Envia para o Render (Substitua se necessário)
      const response = await fetch('https://leitor-jasper-api.onrender.com/inject-nolock/file', {
        method: 'POST',
        body: formData, // Envia como arquivo, não JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao processar arquivo');
      }

      // 2. Transforma a resposta em Download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // 3. Cria um link invisível e clica nele para baixar
      const link = document.createElement('a');
      link.href = downloadUrl;
      // Pega o nome do arquivo que veio do servidor ou define um padrão
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `nolock_${file.name}`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
      // Limpa o input para permitir enviar o mesmo arquivo de novo se quiser
      e.target.value = null;
    }
  };

  return (
    <div className="container">
      <h1><UploadCloud style={{marginBottom: -5}} /> Injetor de NOLOCK</h1>
      <p style={{textAlign: 'center', color: '#6b7280', marginBottom: '2rem'}}>
        Envie seu arquivo <strong>.jrxml</strong>. O sistema adicionará <code>WITH (NOLOCK)</code> automaticamente e iniciará o download.
      </p>

      <div className="upload-area">
        <label htmlFor="file-upload" className="custom-file-upload">
          {loading ? (
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <Loader2 className="spin" /> Processando...
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
              <UploadCloud size={48} color="#2563eb" />
              <span>Clique para selecionar o .jrxml</span>
            </div>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".jrxml"
          onChange={handleFileUpload}
          disabled={loading}
          style={{display: 'none'}}
        />
      </div>

      {erro && (
        <div className="error-box">
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold'}}>
            <AlertCircle size={20} /> Erro
          </div>
          <p>{erro}</p>
        </div>
      )}
    </div>
  );
}

export default App;