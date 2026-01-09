import os
import shutil
import logging
import re
from typing import Dict

logger = logging.getLogger(__name__)


def buscar_fragmento_em_arquivos(origem: str, destino: str, fragmento: str) -> Dict:

    nome_pasta_seguro = re.sub(r'[<>:"/\\|?*]', '_', fragmento)
    nome_pasta_seguro = nome_pasta_seguro.strip()


    caminho_final_destino = os.path.join(destino, nome_pasta_seguro)

    if not os.path.exists(origem):
        raise FileNotFoundError(f"A pasta de origem não existe: {origem}")


    try:
        if not os.path.exists(caminho_final_destino):
            os.makedirs(caminho_final_destino)
            logger.info(f"Diretório de destino criado: {caminho_final_destino}")
    except OSError as e:
        raise OSError(f"Não foi possível criar a pasta em '{caminho_final_destino}'. Erro: {e}")

    arquivos_encontrados = []
    arquivos_ignorados = []

    logger.info(f"Iniciando busca por '{fragmento}' em: {origem}")

    for root, dirs, files in os.walk(origem):
        for arquivo in files:
            if arquivo.lower().endswith(".jrxml"):
                caminho_jrxml = os.path.join(root, arquivo)

                try:
                    with open(caminho_jrxml, 'r', encoding='utf-8', errors='ignore') as f:
                        conteudo_texto = f.read()

                        if fragmento in conteudo_texto:
                            logger.info(f"Código encontrado em: {arquivo}")

                            nome_jasper = arquivo.replace(".jrxml", ".jasper")
                            caminho_jasper = os.path.join(root, nome_jasper)

                            if os.path.exists(caminho_jasper):

                                destino_arquivo = os.path.join(caminho_final_destino, nome_jasper)
                                shutil.copy2(caminho_jasper, destino_arquivo)
                                arquivos_encontrados.append(nome_jasper)
                            else:
                                arquivos_ignorados.append(arquivo)

                except Exception as e:
                    logger.error(f"Erro ao ler {arquivo}: {e}")

    return {
        "termo_buscado": fragmento,
        "pasta_criada": nome_pasta_seguro,
        "caminho_completo": caminho_final_destino,
        "quantidade_copiada": len(arquivos_encontrados),
        "arquivos_jasper_copiados": arquivos_encontrados,
        "arquivos_jrxml_sem_jasper": arquivos_ignorados
    }