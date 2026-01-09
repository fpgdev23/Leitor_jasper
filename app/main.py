import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importa a tua função do scanner
from .services.scanner import buscar_fragmento_em_arquivos

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Jasper Search API")

# Configuração do CORS (Para o React funcionar)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- ATENÇÃO: O Modelo precisa ter os 3 campos ---
class BuscaRequest(BaseModel):
    codigofragmento: str
    caminhoorigem: str
    caminhodestino: str  # <--- Não esqueça de incluir este campo!


@app.post("/buscar")
def endpoint_buscar(dados: BuscaRequest):
    try:
        # Chama a função passando os 3 parâmetros
        return buscar_fragmento_em_arquivos(
            origem=dados.caminhoorigem,
            destino=dados.caminhodestino,
            fragmento=dados.codigofragmento
        )

    # 1. Erro se a pasta de origem não existir (Culpa do usuário -> 400)
    except FileNotFoundError as e:
        logger.warning(f"Erro de validação: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    # 2. Erro se o Windows bloquear a criação da pasta (Culpa do caminho/permissão -> 400)
    except OSError as e:
        logger.error(f"Erro de Sistema Operacional: {e}")
        raise HTTPException(status_code=400, detail=f"Erro ao acessar/criar pastas: {str(e)}")

    # 3. Qualquer outro erro não previsto (Culpa do servidor -> 500)
    except Exception as e:
        logger.exception("Erro crítico não tratado ao buscar fragmento")
        raise HTTPException(status_code=500, detail="Erro interno ao processar a busca.")