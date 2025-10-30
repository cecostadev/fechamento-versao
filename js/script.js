$(document).ready(function () {
  // Objeto para armazenar os dados de cada tarefa
  let taskData = {};
  let currentTaskId = null;
  let currentField = null;

  // Inicializar modais
  const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
  // NOVO: Inicializa o modal para a mensagem final
  const finalMessageModal = new bootstrap.Modal(document.getElementById('finalMessageModal'));

  // Filtro de busca (SEM ALTERAÇÕES)
  $("#searchTask").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#taskList li").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Ao clicar na linha (SEM ALTERAÇÕES)
  $("#taskList").on("click", ".task-item", function () {
    const $li = $(this);
    const taskId = $li.data("task-id");
    const field = $li.data("field");
    const requiresModal = $li.data("requires-modal");
    const taskText = $li.text().trim();

    // Se não requer modal, apenas marca como concluído
    if (requiresModal === false) {
      $li.toggleClass("list-group-item-success text-decoration-line-through");
      return;
    }

    // Se requer modal, abre o modal
    currentTaskId = taskId;
    currentField = field;

    // Preencher o modal
    $("#taskModalLabel").text("Finalizar Tarefa");
    $("#taskDescription").text(taskText);

    // Verificar se é a tarefa 1 (tipos de deploy) para mostrar select
    if (taskId === 1) {
      $("#selectContainer").show();
      $("#inputContainer").hide();
      $("#taskSelect").val(taskData[taskId] || "");
    } else {
      $("#selectContainer").hide();
      $("#inputContainer").show();
      $("#taskInput").val(taskData[taskId] || "");
    }

    taskModal.show();
  });

  // Confirmar no modal (SEM ALTERAÇÕES)
  $("#confirmTask").on("click", function () {
    let inputValue = "";

    // Verificar se é select ou input
    if ($("#selectContainer").is(":visible")) {
      inputValue = $("#taskSelect").val().trim();
    } else {
      inputValue = $("#taskInput").val().trim();
    }

    if (!inputValue) {
      alert("Por favor, preencha o campo antes de confirmar.");
      return;
    }

    // Salvar o valor
    taskData[currentTaskId] = inputValue;

    // Marcar a tarefa como concluída
    const $li = $(`li[data-task-id="${currentTaskId}"]`);
    $li.addClass("list-group-item-success text-decoration-line-through");

    // Atualizar o campo correspondente em Infos extras
    updateInfoFields();

    // Fechar modal
    taskModal.hide();
    $("#taskInput").val("");
    $("#taskSelect").val("");
  });

  // Função para atualizar os campos de Infos extras (SEM ALTERAÇÕES)
  function updateInfoFields() {
    // Agrupar por campo
    let projetoValues = [];
    let versaoValues = [];
    let pipelineValues = [];
    let migrationsValues = [];
    let gmudValues = [];

    // Iterar sobre as tarefas concluídas
    $("#taskList li").each(function () {
      const taskId = $(this).data("task-id");
      const field = $(this).data("field");
      const value = taskData[taskId];

      if (value) {
        switch(field) {
          case "projeto":
            projetoValues.push(value);
            break;
          case "versao":
            versaoValues.push(value);
            break;
          case "pipeline":
            pipelineValues.push(value);
            break;
          case "migrations":
            migrationsValues.push(value);
            break;
          case "gmud":
            gmudValues.push(value);
            break;
        }
      }
    });

    // Atualizar os campos
    $("#projeto").val(projetoValues.join(", "));
    $("#versao").val(versaoValues.join(", "));
    $("#pipeline").val(pipelineValues.join(", "));
    $("#migrations").val(migrationsValues.join(", "));
    $("#gmud").val(gmudValues.join(", "));
  }

  // NOVO: Função para gerar a mensagem de deploy formatada
  function generateDeployMessage() {
    const projetoRaw = $("#projeto").val().trim();
    const versao = $("#versao").val().trim();
    const pipeline = $("#pipeline").val().trim();
    const migrations = $("#migrations").val().trim();
    const gmud = $("#gmud").val().trim();

    let message = "Boa tarde pessoal.\n";
    message += "Segue Solicitação de deploy\n";

    // Formata o projeto e a versão
    let projetoDisplay = projetoRaw ? projetoRaw.replace(/, /g, "/") : "N/A"; // Substitui ", " por "/" se houver múltiplos projetos
    let versaoDisplay = versao ? `(v${versao})` : "";
    message += `${projetoDisplay} - versão${versaoDisplay}\n`;

    // Adiciona GMUD, Pipeline e Script
    message += `GMUD: ${gmud || "N/A"}\n`;
    message += `Pipeline: ${pipeline || "N/A"}\n`;
    message += `Script: ${migrations || "N/A"}\n`;

    // Lógica para o link da Wiki
    let wikiLink = "N/A";
    if (projetoRaw.toLowerCase().includes("siag")) {
        wikiLink = "https://bitbucket.org/devgreencard/siag/wiki/Home";
    } else if (projetoRaw.toLowerCase().includes("portal")) {
        wikiLink = "https://bitbucket.org/devgreencard/portal_estabelecimento/wiki/Home";
    }
    message += `Wiki: ${wikiLink}\n`;

    return message;
  }

  // ALTERADO: Ao clicar no botão "Concluir" (antigo "Exportar para Excel")
  $("#exportExcel").on("click", function () {
    // Gera a mensagem de deploy
    const deployMessage = generateDeployMessage();
    // Insere a mensagem no modal
    $("#finalMessageContent").text(deployMessage);
    // Exibe o modal
    finalMessageModal.show();
  });

  // NOVO: Funcionalidade para copiar a mensagem para a área de transferência
  $("#copyMessageButton").on("click", function() {
    const messageContent = $("#finalMessageContent").text();
    navigator.clipboard.writeText(messageContent).then(function() {
        alert("Mensagem copiada para a área de transferência!");
    }, function(err) {
        console.error("Erro ao copiar mensagem: ", err);
        alert("Erro ao copiar mensagem. Por favor, copie manualmente.");
    });
  });
});
