$(document).ready(function () {
  // Objeto para armazenar os dados de cada tarefa
  let taskData = {};
  let currentTaskId = null;
  let currentField = null;

  // Inicializar modal
  const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));

  // Filtro de busca
  $("#searchTask").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#taskList li").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Ao clicar na linha
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

  // Confirmar no modal
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

  // Função para atualizar os campos de Infos extras
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

  // Exportar para Excel
  $("#exportExcel").on("click", function () {
    var projeto = $("#projeto").val() || "Não informado";
    var versao = $("#versao").val() || "Não informado";
    var pipeline = $("#pipeline").val() || "Não informado";
    var migrations = $("#migrations").val() || "Não informado";
    var gmud = $("#gmud").val() || "Não informado";
    var dataHoje = new Date().toLocaleDateString("pt-BR");

    var dados = [{
      Projeto: projeto,
      Versão: versao,
      Data: dataHoje,
      Pipeline: pipeline,
      Migrations: migrations,
      GMUD: gmud
    }];

    // Exporta
    var ws = XLSX.utils.json_to_sheet(dados);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deploy");

    XLSX.writeFile(wb, "Deploy_" + versao + ".xlsx");
  });
});
