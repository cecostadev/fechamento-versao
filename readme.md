# 📦 Deploy Register & Export Tool

Ferramenta simples para **registrar deploys** em planilha Excel, incluindo versão, data, projeto, tarefas e GMUD.  
Permite manter um **histórico organizado** dos deploys realizados.

---

## 🚀 Funcionalidades

- Registro de **um deploy por linha**.  
- Colunas disponíveis:  
  - **Projeto**  
  - **Versão**  
  - **Data**  
  - **Tarefas** (informadas manualmente – tarefas de sprint, não as da lista de checklist)  
  - **GMUD** (link ou ID relacionado à mudança)  
- Exportação para **Excel (.xlsx)** com um clique.  
- Botão **Exportar** para salvar e organizar o histórico.  

---

## 🛠️ Tecnologias utilizadas

- **HTML5 / Bootstrap / jQuery**  
- **SheetJS (xlsx)** para geração da planilha Excel  

---

## 📖 Como usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/cecostadev/fechamento-versao.git
   cd fechamento-versao

1. Abra o arquivo `index.html` diretamente no navegador.

   > Não é necessário backend ou instalação de dependências.

2. Preencha os campos de **Projeto**, **Versão**, **Tarefas** e **GMUD**.

3. Clique em **Exportar** para gerar o arquivo Excel.

------

## 📂 Estrutura do arquivo Excel

Cada exportação gera uma linha na planilha:

| Projeto   | Versão | Data       | Tarefas                         | GMUD                     |
| --------- | ------ | ---------- | ------------------------------- | ------------------------ |
| Sistema X | v1.2.0 | 23/09/2025 | Ajustes no módulo de pagamentos | GMUD-1234 (link interno) |