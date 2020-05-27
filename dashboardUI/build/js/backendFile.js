$(document).ready(function(){
  $('#exampleFormControlFile1').val('');
});

$('#btnCaracteristicas').click(function(e){
    e.preventDefault();  //stop the browser from following
    window.location.href = "https://3mjm5v2pt5.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/actualizacionmasiva/descargararchivo";
    
});

$('#btnEspecificaciones').click(function(e){
    e.preventDefault();  //stop the browser from following
    window.location.href = "../../files/OUT/Especificaciones.csv";
    
});

$('#btnSubir').click(function(e){

  var file = $("#exampleFormControlFile1").get(0).files;

  if($('#exampleFormControlFile1').val() != ''){
    var varFile = $("#exampleFormControlFile1").get(0).files;
    var fd = new FormData();
    var files = $('#exampleFormControlFile1')[0].files[0];
    fd.append('file',files);

    console.log(varFile);
    
    var api_url = 'https://oa96bjf838.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/actualizacionmasiva/subirarchivo';

    $.ajax({
            
      url: api_url,
      headers: { 
          'x-api-key' : '5OoJZQQzO7aUJ17qFRoKZ9iTuKL6PU9NDlTU9wsa',
          'Content-Type' : 'application/csv'

      },
      type: "POST",
      contentType: false,
      processData: false,
      data: fd,
      success: function(result){
          

          if (typeof NProgress != 'undefined') {
      
              NProgress.done();
          }
          console.log("success: " + result.body);
      },
      error: function(result){
          if (typeof NProgress != 'undefined') {
      
              NProgress.done();
          }
          console.log("error: " + result);
      }
  })

  }
  
  
});

var dropzone = Dropzone.options.myAwesomeDropzone = {
    init: function() {
        this.on("addedfile", function(file) { alert("Added file."); });
      },
      url: '../../files/IN/',
      method: 'POST',
      autoProcessQueue: false,
      uploadMultiple: false,
      parallelUploads: 1,
      maxFiles: 1,
      addRemoveLinks: true,
    paramName: "file", // The name that will be used to transfer the file
    maxFilesize: 2, // MB
    accept: function(file, done) {
      if (file.name == "justinbieber.jpg") {
        done("Naha, you don't.");
      }
      else { done(); }
    }
  };