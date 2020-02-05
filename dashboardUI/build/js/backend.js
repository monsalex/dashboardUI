$(document).ready(function(){
    //alert('')
    var api_url = 'https://3x6w4x1m7e.execute-api.us-east-1.amazonaws.com/dev/servreportingdashboardorders'

    $.ajax({
        url: api_url,
        method: "POST",
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            var data = JSON.parse(result.body);
            console.log(data); 
            console.log(data.ordersByStat.length);            
        }
    })
});