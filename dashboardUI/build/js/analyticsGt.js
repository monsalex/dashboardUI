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
        data['reports'].forEach(element=>{
          //console.log("Response Transacciones", element.data.totals[0].values);
          $("#gaTransactions").html(new Intl.NumberFormat('en-US').format(element.data.totals[0].values));
        })
        


        
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

        data['reports'].forEach(element=>{
          //console.log("ResponseSecond Sesiones", element.data.totals[0].values);
          $("#gaSessions").html(new Intl.NumberFormat('en-US').format(element.data.totals[0].values));
        })
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
        
        data['reports'].forEach(element=>{
          //console.log("ResponseSecond Conversion", element.data.totals[0].values);
          $("#gaConversionRate").html((element.data.totals[0].values[0].substr(0,4))+"%");
        })
      })
    }
    catch{

    }
  }

  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "885538413003-ht2erv68oif3hn7075img01hkten7gl0.apps.googleusercontent.com"});
  });