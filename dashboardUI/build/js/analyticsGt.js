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
        execute();
        executeSessions();
        executeConversion();
      },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.analyticsreporting.reports.batchGet({
      "resource": {
        "reportRequests": [
          {
            "viewId": "202744596",
            "dateRanges": [
              {
                "startDate": "2020-03-11",
                "endDate": "2020-03-11"
              }
            ],
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
      console.log("Response Transacciones", data);
      
    },
    function(err) { console.error("Execute error", err); });
  }

  function executeSessions(){
    return gapi.client.analyticsreporting.reports.batchGet({
      "resource": {
        "reportRequests": [
          {
            "viewId": "202744596",
            "dateRanges": [
              {
              "startDate": "2020-03-11",
              "endDate": "2020-03-11"
              }
            ],
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
      console.log("ResponseSecond Sesiones", data)
    })
  }

  function executeConversion(){
    return gapi.client.analyticsreporting.reports.batchGet({
      "resource": {
        "reportRequests": [
          {
            "viewId": "202744596",
            "dateRanges": [
              {
              "startDate": "2020-03-11",
              "endDate": "2020-03-11"
              }
            ],
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
      console.log("ResponseSecond Conversion", data)
    })
  }

  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "885538413003-ht2erv68oif3hn7075img01hkten7gl0.apps.googleusercontent.com"});
  });