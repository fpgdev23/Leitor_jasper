import os
import shutil
import logging
import zipfile
import tempfile
from pathlib import Path

logger = logging.getLogger(__name__)


def processar_zip_e_buscar(conteudo_zip: bytes, fragmento: str) -> str:
    """
    Recebe o ZIP, extrai, busca o fragmento nos JRXML e separa os JASPERs.
    Retorna o caminho do novo ZIP gerado.
    """
    # Cria uma pasta temporária para fazer a bagunça
    with tempfile.TemporaryDirectory() as temp_dir:
        dir_entrada = os.path.join(temp_dir, "entrada")
        dir_saida = os.path.join(temp_dir, "saida")
        os.makedirs(dir_entrada)
        os.makedirs(dir_saida)

        # 1. Salva e Extrai o ZIP enviado pelo usuário
        caminho_zip_entrada = os.path.join(temp_dir, "input.zip")
        with open(caminho_zip_entrada, "wb") as f:
            f.write(conteudo_zip)

        try:
            with zipfile.ZipFile(caminho_zip_entrada, 'r') as zip_ref:
                zip_ref.extractall(dir_entrada)
        except zipfile.BadZipFile:
            raise ValueError("O arquivo enviado não é um ZIP válido.")

        # 2. Executa a TUA lógica de busca
        arquivos_encontrados = 0

        for root, dirs, files in os.walk(dir_entrada):
            for arquivo in files:
                if arquivo.lower().endswith(".jrxml"):
                    caminho_jrxml = os.path.join(root, arquivo)

                    try:
                        with open(caminho_jrxml, 'r', encoding='utf-8', errors='ignore') as f:
                            conteudo_texto = f.read()

                            # AQUI ESTÁ A TUA LÓGICA DE BUSCA
                            if fragmento in conteudo_texto:
                                nome_jasper = arquivo.replace(".jrxml", ".jasper")
                                caminho_jasper = os.path.join(root, nome_jasper)

                                # Se o jasper existir, copia para a pasta de saída
                                if os.path.exists(caminho_jasper):
                                    shutil.copy2(caminho_jasper, os.path.join(dir_saida, nome_jasper))
                                    arquivos_encontrados += 1

                    except Exception as e:
                        logger.error(f"Erro ao ler {arquivo}: {e}")

        if arquivos_encontrados == 0:
            raise FileNotFoundError(f"Nenhum arquivo encontrado contendo o código '{fragmento}'.")

        # 3. Compacta os resultados num novo ZIP
        caminho_zip_saida = os.path.join(tempfile.gettempdir(), "resultado_busca.zip")
        with zipfile.ZipFile(caminho_zip_saida, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(dir_saida):
                for file in files:
                    caminho_absoluto = os.path.join(root, file)
                    # Adiciona ao zip apenas com o nome do arquivo (sem pastas extras)
                    zipf.write(caminho_absoluto, arcname=file)

        return caminho_zip_saida