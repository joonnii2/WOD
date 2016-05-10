define([
  'app'
], function (app) {
  'use strict';

  app.factory('UtilsSvc', [
  	'$http',
    '$httpParamSerializerJQLike',
  	'ENV',
    function ($http, $httpParamSerializerJQLike, ENV) {
    	console.log(ENV.API_ENDPOINT);
      return {
        doService : function(url, data, method, header) {
          if (method == undefined || method == null) method = 'POST';
          if (header == undefined || header == null) 
            header = {
                  'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                  //'Content-Type': 'application/json',
                  'Accept': 'application/json, text/plain, */*'
                };
          var req = {
                method : method,
                url : ENV.API_ENDPOINT + url,
                headers : header,
                data : $httpParamSerializerJQLike(data),
                withCredentials: true
              };

          console.log('[UtilSvc.doService] Request : ' + ENV.API_ENDPOINT + url);
          console.log(req);

          return $http(req).then(
              function(res) {
                console.log('[UtilSvc.doService] Response : ' + ENV.API_ENDPOINT + url);
                console.log(res.data);
                return res.data;
              },
              function (err) {
                console.log('[UtilSvc.doService] Error : ' + ENV.API_ENDPOINT + url);
                console.log(err.data);
                throw err.status + ' : ' + err.data;
              }
            );
        },
        doGet : function(url) {
          console.log('UtilSvc.doGet');
          console.log(url);
  	  		return $http.get(ENV.API_ENDPOINT + url).then(
  	  			function(res) {
  	  				return res.data;
  	  			},
            function (httpError) {
              console.log('서버 통신중 오류가 발생했습니다.');
              console.log(httpError);
              throw httpError.status + " : " + httpError.data;
            }
  	  		);
      	},
      	doPost : function(url, param) {
          console.log('[UtilSvc.doPost] '+ENV.API_ENDPOINT + url);
          console.log(param);
      		return $http.post(ENV.API_ENDPOINT + url, $httpParamSerializerJQLike(param), 
            {
              withCredentials: true
              ,headers : {
               'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
               //'Content-Type': 'application/json',
               'Accept': 'application/json, text/plain, */*'
               }
            }).then(
      			function(res) {
      				return res;
      			},
            function (httpError) {
              console.log('서버 통신중 오류가 발생했습니다.');
              console.log(httpError);
              throw httpError.status + " : " + httpError.data;
            }
      		);
      	},
        doCheckApplication : function(appData) {
          var req = {
                method : 'POST',
                url : ENV.API_ENDPOINT + ENV.CHECK_URL,
                headers : {
                  'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                  //'Content-Type': 'application/json',
                  'Accept': 'application/json, text/plain, */*'
                },
                data : $httpParamSerializerJQLike($.extend(appData, ENV)),
                withCredentials: true
              };

          console.log('[UtilSvc.doService] Request : '+ENV.API_ENDPOINT + ENV.CHECK_URL);
          console.log(req);

          return $http(req).then(
              function(res) {
                console.log('[UtilSvc.doService] Response : '+ENV.API_ENDPOINT + ENV.CHECK_URL);
                console.log(res.data);
                return res.data;
              },
              function (err) {
                console.log('[UtilSvc.doService] Error : '+ENV.API_ENDPOINT + ENV.CHECK_URL);
                console.log(err.data);
                throw err.status + ' : ' + err.data;
              }
            );
        }
      };
    }
  ]);
});
