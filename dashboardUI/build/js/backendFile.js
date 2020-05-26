$('#btnCaracteristicas').click(function(e){
    e.preventDefault();  //stop the browser from following
    window.location.href = "https://3mjm5v2pt5.execute-api.us-east-1.amazonaws.com/production/elektra/guatemala/actualizacionmasiva/descargararchivo";
    
});

$('#btnEspecificaciones').click(function(e){
    e.preventDefault();  //stop the browser from following
    window.location.href = "../../files/OUT/Especificaciones.csv";
    
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