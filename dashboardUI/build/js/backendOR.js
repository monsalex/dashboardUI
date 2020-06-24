$(document).ready(function () {

    $("#txtSkuOR").val("");
    ReloadTableOR();
  });

  $("#btnORDesactivar").click(function (e) {
    if($("#txtSkuOR").val() != '' && $("#txtSkuOR").val() == 0 ){
      
    }
  });
  
  $("#btnOREnviar").click(function (e) {
    if($("#txtSkuOR").val() != '' ){

      var api_url = "https://api.integracionektgt.com/fo-prod-v1/ektgtl/flashoffer/saveflashoffer";
      var params = [];

      params = {
          "idSku" : $("#txtSkuOR").val(),
          "user" : "",
          "isActive" : 1
      };

      //console.log(JSON.stringify(params));

      $.ajax({
        url: api_url,
        headers: {
          "Content-Type": "application/csv",
        },
        method: "POST",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(params),
        success: function (result) {
          
          data = JSON.parse(result.body);
          //console.log(result.statusCode);

          

          if (typeof NProgress != "undefined") {
            NProgress.done();
          }

          if(result.statusCode == 200){
            
            if($("#txtSkuOR").val() != 0){
            new PNotify({
              title: "Actualizado",
              text: "¡Se creo la oferta relámpago para el SKU: "+$("#txtSkuOR").val()+"!",
              type: "success",
              styling: "bootstrap3",
            });
          }else{
            new PNotify({
              title: "Actualizado",
              text: "¡Se apagó la oferta relámpago!",
              type: "warning",
              styling: "bootstrap3",
            });
          }
            $("#txtSkuOR").val('');
            ReloadTableOR();
          }
          
        },
        error: function (result) {
          if (typeof NProgress != "undefined") {
            NProgress.done();
  
            
          }
          console.log("error: " + result);
          new PNotify({
            title: "¡Oh No!",
            text: "Algo terrible suciedió.",
            type: "error",
            styling: "bootstrap3",
          });
        },
      });
    }
    
  });

  $("#lnkRefrescar").click(function (e){
    ReloadTableOR();
  })

  function ReloadTableOR(){
    var api_url = 'https://api.integracionektgt.com/fo-prod-v1/ektgtl/flashoffer/listoffers';

    if (typeof NProgress != "undefined") {
        NProgress.start();
      }
  
      $.ajax({
        url: api_url,
        headers: {
          "Content-Type": "application/csv",
        },
        method: "GET",
        data: "",

        success: function (result) {
          
          data = JSON.parse(result.body);
          //console.log(data);

          fillFlashSaleTable(data);

          if (typeof NProgress != "undefined") {
            NProgress.done();
          }

          /*if (result.statusCode == 200) {
            //console.log(result);
            new PNotify({
              title: "Actualizado",
              text: "¡Se subió el archivo y se actualizaron los registros!",
              type: "success",
              styling: "bootstrap3",
            });
  
            $("#exampleFormControlFile1").val("");
            $("#exampleFormControlFileSpecs").val("");
  
            $("#btnCancel").hide();
            $("#btnSubir").hide();
            $("#btnCancelSpecs").hide();
            $("#btnSubirSpecs").hide();
          } else if (result.statusCode == 500) {
            new PNotify({
              title: "¡Oh No!",
              text: result.body,
              type: "error",
              styling: "bootstrap3",
            });
            $("#btnCancel").prop("disabled", false);
            $("#btnSubir").prop("disabled", false);
            $("#btnSubirSpecs").prop("disabled", false);
            $("#btnCancelSpecs").prop("disabled", false);
          }*/
        },
        error: function (result) {
          if (typeof NProgress != "undefined") {
            NProgress.done();
  
            
          }
          console.log("error: " + result);
          new PNotify({
            title: "¡Oh No!",
            text: "Algo terrible suciedió.",
            type: "error",
            styling: "bootstrap3",
          });
        },
      });

    

  }

  function fillFlashSaleTable(data){

    if(data == null) return;

    var tableHeader = '<thead><tr><th>Num</th><th>Sku</th><th>Fecha</th><th>Activo</th></tr></thead>';
    var tableBody = '<tbody>';
    var flag = 1;

    for(var i = data.length-1; i>=0;i--){
        tableBody += '<tr><td>'+ data[i].idOfertaRelampago +'</td><td>'+data[i].idSku+'</td><td>'+data[i].dateInsert.substring(0,10)+'</td><td>'+(data[i].isActive?1:0)+'</td></tr>';
        flag = 0;
    }
    tableBody += '</tbody>';

    $("#datatable-buttons_oferta").DataTable({}).destroy();
    $("#datatable-buttons_oferta").html(tableHeader + tableBody);

    var handleDataTableButtons = function () {
        if ($("#datatable-buttons_oferta").length) {
            $("#datatable-buttons_oferta").DataTable({
                dom: "Blfrtip",
                //order: [[ 4, "desc" ]],
                buttons: [
                    {
                        extend: "copy",
                        className: "btn-sm"
                    },
                    {
                        extend: "csv",
                        className: "btn-sm"
                    },
                    {
                        extend: "excel",
                        className: "btn-sm"
                    },
                    {
                        extend: "pdfHtml5",
                        className: "btn-sm"
                    },
                    {
                        extend: "print",
                        className: "btn-sm"
                    },
                ],
                responsive: true
            });
        }
    };

    TableManageButtons = function () {
        "use strict";
        return {
            init: function () {
                handleDataTableButtons();
            }
        };
    }();

    
    TableManageButtons.init();
  }