var logIn = false;

function logInFirst(){
  if(!logIn)
    authenticate().then(loadClient);
}

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    
    gapi.client.setApiKey("AIzaSyDiKmOq2EOKENRmhSFcgkV2V__4uT-atlQ");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/analyticsreporting/v4/rest")
        .then(function() { console.log("GAPI client loaded for API");
        logIn = true;
        var paramDate = 
          {
          "fdFechaInit" : moment().format("YYYY-MM-DD"),
          "fdFechaFin" : moment().format("YYYY-MM-DD")
        }
        

        getAanlyticsData(paramDate);


      },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }

  function getAanlyticsData(params){
    //console.log("ga ", params)
    if(gapi.client){
      
      execute(params);
      executeSessions(params);
      executeConversion(params);
    }
  
  }

  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute(params) {
    try{
      return gapi.client.analyticsreporting.reports.batchGet({
        "resource": {
          "reportRequests": [
            {
              "viewId": "202744596",
              "dateRanges": [{
                "startDate":params.fdFechaInit,
                "endDate" : params.fdFechaFin
              }],
              "dimensions":[
                {
                "name": "ga:acquisitionTrafficChannel"
                }
              ],
              "metrics" : [
                {
                  "expression":"ga:transactions"
                }
              ]
            }
          ]
        }
      }).then(function(response) {
        // Handle the results here (response.result has the parsed body).
        var data = JSON.parse(response.body);
        var totalTransactions = 0;
        var divhtmlT = "";


        data['reports'].forEach(element=>{
          //console.log("Response Transacciones", element.data.totals[0].values);
          totalTransactions=element.data.totals[0].values[0]
          $("#gaTransactions").html(new Intl.NumberFormat('en-US').format(element.data.totals[0].values[0]));
        })
        
        data['reports'][0].data.rows.forEach(element=>{
          //console.log("ResponseSecond Transactions ", element.dimensions[0], element.metrics[0].values[0]);
          divhtmlT += '<div class="widget_summary">'
          divhtmlT += '<div class="w_left w_25">'
          divhtmlT += '<span>'+ element.dimensions[0] +'</span>'
          divhtmlT += '</div>'
          divhtmlT += '<div class="w_center w_55">'
          divhtmlT += '<div class="progress">'
          divhtmlT += '<div class="progress-bar bg-blue" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+ Math.round((element.metrics[0].values[0]/totalTransactions)*100) +'%;">'
          divhtmlT += '</div>'
          divhtmlT += '</div>'
          divhtmlT += '</div>'
          divhtmlT += '<div class="w_right w_20">'
          divhtmlT += '<span style="font-size: 15px !important;">'+ new Intl.NumberFormat('en-US').format(element.metrics[0].values[0]) +'</span>'
          divhtmlT += '</div>'
          divhtmlT += '<div class="clearfix"></div>'
          divhtmlT += '</div>'
        })

        $("#divTransactions").html(divhtmlT);
        
      },
      function(err) { console.error("Execute error", err); });
    }
    catch{

    }
  }

  function executeSessions(params){
    try{
      return gapi.client.analyticsreporting.reports.batchGet({
        "resource": {
          "reportRequests": [
            {
              "viewId": "202744596",
              "dateRanges": [{
                "startDate":params.fdFechaInit,
                "endDate" : params.fdFechaFin
              }],
              "dimensions":[
                {
                "name": "ga:acquisitionTrafficChannel"
                }
              ],
              "metrics" : [
                {
                  "expression":"ga:sessions"
                }
              ]
            }
          ]
        }
      }).then(function(response){
        var data = JSON.parse(response.body);
        var totalSessions = 0;
        var divhtml = "";
        data['reports'].forEach(element=>{
          //console.log("ResponseSecond Sesiones", element.data.totals[0].values);
          totalSessions = element.data.totals[0].values[0]
          $("#gaSessions").html(new Intl.NumberFormat('en-US').format(totalSessions));
        })

        //console.log("ResponseSecond Sesiones", data['reports'][0]);

        data['reports'][0].data.rows.forEach(element=>{
          //console.log("ResponseSecond Sesiones", element.dimensions[0], element.metrics[0].values[0]);
          divhtml += '<div class="widget_summary">'
          divhtml += '<div class="w_left w_25">'
          divhtml += '<span>'+ element.dimensions[0] +'</span>'
          divhtml += '</div>'
          divhtml += '<div class="w_center w_55">'
          divhtml += '<div class="progress">'
          divhtml += '<div class="progress-bar bg-orange" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+ Math.round((element.metrics[0].values[0]/totalSessions)*100) +'%;">'
          divhtml += '</div>'
          divhtml += '</div>'
          divhtml += '</div>'
          divhtml += '<div class="w_right w_20">'
          divhtml += '<span style="font-size: 15px !important;">'+ new Intl.NumberFormat('en-US').format(element.metrics[0].values[0]) +'</span>'
          divhtml += '</div>'
          divhtml += '<div class="clearfix"></div>'
          divhtml += '</div>'
        })
        
        $("#divSessions").html(divhtml)

      })
    }
    catch{

    }
  }

  function executeConversion(params){
    try{
      return gapi.client.analyticsreporting.reports.batchGet({
        "resource": {
          "reportRequests": [
            {
              "viewId": "202744596",
              "dateRanges": [{
                "startDate":params.fdFechaInit,
                "endDate" : params.fdFechaFin
              }],
              "dimensions":[
                {
                "name": "ga:acquisitionTrafficChannel"
                }
              ],
              "metrics" : [
                {
                  "expression":"ga:transactionsPerSession"
                }
              ]
            }
          ]
        }
      }).then(function(response){
        var data = JSON.parse(response.body);
        var totalConversion = 0.0;
        var divhtmlC = "";
        data['reports'].forEach(element=>{
          //console.log("ResponseSecond Conversion", element.data.totals[0].values);
          totalConversion = element.data.totals[0].values[0].substr(0,4);
          $("#gaConversionRate").html((element.data.totals[0].values[0].substr(0,4))+"%");
        })

        data['reports'][0].data.rows.forEach(element=>{
          //console.log("ResponseSecond Convers", element.dimensions[0], element.metrics[0].values[0]);
          divhtmlC += '<div class="widget_summary">'
          divhtmlC += '<div class="w_left w_25">'
          divhtmlC += '<span>'+ element.dimensions[0] +'</span>'
          divhtmlC += '</div>'
          divhtmlC += '<div class="w_center w_55">'
          divhtmlC += '<div class="progress">'
          divhtmlC += '<div class="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+ Math.round((element.metrics[0].values[0].substr(0,4)/totalConversion)) +'%;">'
          divhtmlC += '</div>'
          divhtmlC += '</div>'
          divhtmlC += '</div>'
          divhtmlC += '<div class="w_right w_20">'
          divhtmlC += '<span style="font-size: 15px !important;">'+ new Intl.NumberFormat('en-US').format(element.metrics[0].values[0].substr(0,4)) +'%</span>'
          divhtmlC += '</div>'
          divhtmlC += '<div class="clearfix"></div>'
          divhtmlC += '</div>'
        })

        $("#divConversionRate").html(divhtmlC);


      })
    }
    catch{

    }
  }

  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "885538413003-ht2erv68oif3hn7075img01hkten7gl0.apps.googleusercontent.com"});
  });