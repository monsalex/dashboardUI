$(document).ready(function(){
  $('#exampleFormControlFile1').val('');
  $("#btnCancel").hide();
  $('#btnSubir').hide();
});

$('#btnCaracteristicas').click(function(e){
    e.preventDefault();  //stop the browser from following
    $('#exampleFormControlFile1').val('');
    window.location.href = "https://3mjm5v2pt5.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/actualizacionmasiva/descargararchivo";
    
});

$('#btnEspecificaciones').click(function(e){
    e.preventDefault();  //stop the browser from following
    window.location.href = "../../files/OUT/Especificaciones.csv";
    
});

var filebase64 = '';
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
            }
            if (file) {
                reader.readAsDataURL(file);
            }

            $("#btnCancel").show();
            $('#btnSubir').show();
        });
      });

$("#btnCancel").click(function(e){
  $('#exampleFormControlFile1').val('');
  $("#btnCancel").hide();
  $('#btnSubir').hide();
});

$('#btnSubir').click(function(e){


  if($('#exampleFormControlFile1').val() != ''){

    var obj = {};
    obj.data = filebase64;
    obj.name = fileName;

    var fd = new FormData();
    var files = $('#exampleFormControlFile1')[0].files[0];
    fd.append('file',files);

    //console.log($('#exampleFormControlFile1')[0].files[0]);
    //console.log(files.name);

    if (typeof NProgress != 'undefined') {
            
      NProgress.start();
      
  }

    var api_url = 'https://oa96bjf838.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/actualizacionmasiva/subirarchivo';

    $.ajax({
            
      url: api_url,
      headers: { 
          'Content-Type' : 'application/csv'
      },
      type: "POST",
      //data: filebase64,
      data: files,
      //contentType: 'text/csv;base64',
      contentType: false,
      processData: false,
      success: function(result){
          

          if (typeof NProgress != 'undefined') {
      
              NProgress.done();
              $('#exampleFormControlFile1').val('');
              $("#btnCancel").hide();
              $('#btnSubir').hide();
          }
          //console.log(result);
          new PNotify({
            title: 'Actualizado',
            text: '¡Se subió el archivo y se actualizaron los registros!',
            type: 'success',
            styling: 'bootstrap3'
        });

      },
      error: function(result){
          if (typeof NProgress != 'undefined') {
      
              NProgress.done();
              $('#exampleFormControlFile1').val('');
              $("#btnCancel").hide();
              $('#btnSubir').hide();
          }
          console.log("error: " + result);
          new PNotify({
            title: '¡Oh No!',
            text: 'Algo terrible suciedió.',
            type: 'error',
            styling: 'bootstrap3'
        });
      }
  })

  }
  
  
});
