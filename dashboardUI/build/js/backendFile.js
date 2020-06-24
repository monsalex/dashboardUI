$(document).ready(function () {
  $("#exampleFormControlFile1").val("");

  $("#exampleFormControlFileSpecs").val("");
});

$("#btnCaracteristicas").click(function (e) {
  e.preventDefault(); //stop the browser from following
  $("#exampleFormControlFile1").val("");
  window.location.href =
    "https://3mjm5v2pt5.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/actualizacionmasiva/descargararchivo";
});

$("#btnEspecificaciones").click(function (e) {
  e.preventDefault(); //stop the browser from following
  window.location.href ="https://wujyr09ny8.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/specification/downloadfile";
    
    
});

$("#btnValores").click(function (e) {
  e.preventDefault(); //stop the browser from following
  window.location.href = "https://n2ygkftt18.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/especificaciones/obtenervalores/descargaarchivo"; 

});

var filebase64 = "";
var fileName;
$(function () {
  $("input[type=file]").change(function (e) {
    var file = e.target.files[0];
    fileName = e.target.files[0].name;
    var reader = new FileReader();
    reader.onload = function (e) {
      //$('#hfBase64').val(e.target.result);
      filebase64 = e.target.result;
      //alert(filebase64);
    };
    if (file) {
      reader.readAsDataURL(file);
    }

    $("#btnCancel").show();
    $("#btnSubir").show();
    $("#btnCancelSpecs").show();
    $("#btnSubirSpecs").show();
    $("#btnCancel").prop("disabled", false);
    $("#btnSubir").prop("disabled", false);
    $("#btnSubirSpecs").prop("disabled", false);
    $("#btnCancelSpecs").prop("disabled", false);
  });
});

$("#btnCancel").click(function (e) {
  $("#exampleFormControlFile1").val("");
  $("#btnCancel").hide();
  $("#btnSubir").hide();
});

$("#btnCancelSpecs").click(function (e) {
  $("#exampleFormControlFileSpecs").val("");
  $("#btnCancelSpecs").hide();
  $("#btnSubirSpecs").hide();
});

$("#btnSubir").click(function (e) {
  var api_url =
    "https://oa96bjf838.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/actualizacionmasiva/subirarchivo";

  var objfile = $("#exampleFormControlFile1");
  UploadFile(objfile, api_url);
  $("#btnSubir").prop("disabled", true);
  $("#btnCancel").prop("disabled", true);
});

$("#btnSubirSpecs").click(function (e) {
  var api_url =
    "https://cggn7442a7.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/specification/uploadfile";
  var objfile = $("#exampleFormControlFileSpecs");
  UploadFile(objfile, api_url);

  $("#btnSubirSpecs").prop("disabled", true);
  $("#btnCancelSpecs").prop("disabled", true);
});

function UploadFile(objfile, api_url) {
  //console.log(objfile);
  //console.log(api_url);
  if (objfile.val() != "") {
    var files = objfile[0].files[0];

    if (typeof NProgress != "undefined") {
      NProgress.start();
    }

    $.ajax({
      url: api_url,
      headers: {
        "Content-Type": "application/csv",
      },
      type: "POST",
      //data: filebase64,
      data: files,
      //contentType: 'text/csv;base64',
      contentType: false,
      processData: false,
      success: function (result) {
        if (typeof NProgress != "undefined") {
          NProgress.done();
        }
        if (result.statusCode == 200) {
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
        }
      },
      error: function (result) {
        if (typeof NProgress != "undefined") {
          NProgress.done();

          $("#btnCancel").prop("disabled", false);
          $("#btnSubir").prop("disabled", false);
          $("#btnSubirSpecs").prop("disabled", false);
          $("#btnCancelSpecs").prop("disabled", false);
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
}
