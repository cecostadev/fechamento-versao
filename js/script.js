$(document).ready(function () {
    // Filtro de busca
    $("#searchTask").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#taskList li").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  
    // Clique para riscar tarefa concluída (apenas visual)
    $("#taskList").on("click", "li", function () {
      $(this).toggleClass("list-group-item-success text-decoration-line-through");
    });
  
    // Exportar para Excel (uma linha por deploy)
    $("#exportExcel").on("click", function () {
      var projeto = $("#projeto").val() || "Não informado";
      var versao = $("#versao").val() || "Não informado";
      var tarefas = $("#tarefas").val() || "Nenhuma";
      var gmud = $("#gmud").val() || "Não informado";
      var dataHoje = new Date().toLocaleDateString("pt-BR");
  
      var dados = [{
        Projeto: projeto,
        Versão: versao,
        Data: dataHoje,
        Tarefas: tarefas,
        GMUD: gmud
      }];
  
      // Exporta
      var ws = XLSX.utils.json_to_sheet(dados);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Deploy");
  
      XLSX.writeFile(wb, "Deploy_" + versao + ".xlsx");
    });
  });
  