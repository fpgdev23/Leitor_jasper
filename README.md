# Arquitetura e Tecnologias

**Back-end (API):**

* **Linguagem:** Python 3.12
* **Framework:** FastAPI
* **Servidor:** Uvicorn.
* **Lógica Principal:** Leitura de arquivos de texto (`.jrxml`) e manipulação de sistema de arquivos (`shutil`, `os`).

**Front-end (Interface):**

* **Framework:** React.js (via Vite).
* **Estilização:** CSS Customizado (Responsivo e Clean).
* **Comunicação:** Fetch API para consumo dos endpoints REST.

## Funcionalidades Implementadas

1. **Busca Inteligente ("Estratégia de Par Casado"):**

* O sistema varre arquivos `.jrxml` (XML legível) procurando pelo termo desejado.
* Ao encontrar, identifica o arquivo `.jasper` (Binário) correspondente na mesma pasta.



2. **Definição de Caminhos Dinâmica:**

* Usuário define a **Pasta de Origem** (onde buscar).
* Usuário define a **Pasta de Destino** (onde salvar).



3. **Organização Automática:**

* Cria automaticamente uma subpasta no destino com o nome do código buscado (higienizado para remover caracteres ilegais do Windows).



4. **Tratamento de Erros:**

* Validação de caminhos inexistentes (Erro 400).
* Tratamento de falhas de permissão de escrita (Erro 400).
* Logs detalhados no terminal do servidor para auditoria.



## Como Executar (Ambiente de Desenvolvimento)

**1. Back-end (Python):**
No terminal, dentro da pasta raiz `jasper\\\\\\\_search\\\\\\\_api/`:

```bash
uvicorn app.main:app --reload

```

*Porta:* `http://127.0.0.1:8000`

**2. Front-end (React):**
No terminal, dentro da pasta `jasper\\\\\\\_search\\\\\\\_api/jasper-front/`:

```bash
npm run dev

```

*Porta:* `http://localhost:5173`

## Exemplo de Uso

* **Fragmento:** `2a5985c3-5dce-4f15-b380` (UUID do elemento)
* **Origem:** `C:\\\\\\\\Projetos\\\\\\\\Relatorios\\\\\\\\Fonte`
* **Destino:** `C:\\\\\\\\Projetos\\\\\\\\Entregas`
* **Resultado:** O sistema cria `C:\\\\\\\\Projetos\\\\\\\\Entregas\\\\\\\\2a5985c3-5dce...\\\\\\\\` e copia os arquivos `.jasper` encontrados.
