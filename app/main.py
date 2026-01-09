import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from .services.scanner import processar_zip_e_buscar

app = FastAPI(title="Jasper Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/buscar")
async def endpoint_buscar(
        fragmento: str = Form(...),
        arquivo_zip: UploadFile = File(...)
):
    """
    Recebe um ZIP com relatórios e um código (fragmento).
    Retorna um ZIP contendo apenas os .jasper encontrados.
    """
    try:
        conteudo_zip = await arquivo_zip.read()

        # Chama o processador
        caminho_zip_resultado = processar_zip_e_buscar(conteudo_zip, fragmento)

        # Devolve o arquivo ZIP gerado
        return FileResponse(
            path=caminho_zip_resultado,
            filename=f"jaspers_encontrados_{fragmento}.zip",
            media_type='application/zip'
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")