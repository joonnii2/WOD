define([
  'app'
], function (app) {
  'use strict';

  app.factory('SessionSvc', [
    '$http', 
    '$rootScope',
    'ENV',
    function ($http, $rootScope, env) {

      $rootScope.sessionInfo = null;
      $rootScope.isAuthenticated = false;

      try {
          $rootScope.sessionInfo = JSON.parse(window.localStorage.getItem(env.LOCAL_TOKEN_KEY) || "{}");
      } catch(e) {
          $rootScope.sessionInfo = {};
      };

      return {
        // 세션 정보 조회
        getSessionInfo : function() {
          return $rootScope.sessionInfo;
        },
        // 로그인 여부
        isUserSignedIn : function () {
          if(this.getSessionInfo() && this.getSessionInfo().userId) {
            return true;
          } else {
            return false;
          }
        },
        // 세션 정보 생성
        setSessionInfo : function (info) {
          try {
            angular.extend($rootScope.sessionInfo, info);
            window.localStorage.setItem(env.LOCAL_TOKEN_KEY, JSON.stringify($rootScope.sessionInfo));
            $rootScope.isAuthenticated = true;
            $http.defaults.headers.common['X-Auth-Token'] = this.getSessionInfo();
            console.log('[SessionSvc.setSessionInfo] Successfully created the session.');
            console.log(this.getSessionInfo());
            return true;
          } catch(e) {
            console.log('[SessionSvc.setSessionInfo] Session creation failed.');
            return false;
          };
        },
        // 세션 정보 삭제
        removeSessionInfo : function () {
          try {
            $rootScope.sessionInfo = {};
            window.localStorage.setItem(env.LOCAL_TOKEN_KEY, JSON.stringify($rootScope.sessionInfo));
            $rootScope.isAuthenticated = false;
            $http.defaults.headers.common['X-Auth-Token'] = undefined;
            console.log('[SessionSvc.setSessionInfo] Session Removed.');
            console.log(this.getSessionInfo());
            return true;
          } catch(e) {
            console.log('[SessionSvc.setSessionInfo] Failed to remove the session.');
            return false;
          };
        }
      };











      // var isAuthenticated = false;
      // var authToken;
      // var LOCAL_TOKEN_KEY = '_wodTokenKey';
      // var userInfo = null;

      // function loadUserCredentials() {
      //   var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      //   if (token) {
      //     useCredenticals(token);
      //   };
      // };

      // function storeUserCredentials(token) {
      //   window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      //   useCredenticals(token);
      // };

      // function useCreDentials(token) {
      //   userInfo = token;
      //   isAuthenticated = true;
      //   authToken = token;

      //   $http.defaults.headers.common['X-Auth-Token'] = token;

      // };

      // function destroyUserCredentials() {
      //   authToken = undefined;
      //   userInfo = null;
      //   isAuthenticated = false;
      //   $http.defaults.headers.common['X-Auth-Token'] = undefined;
      //   window.localStorage.removeItem(LOCAL_TOKEN_KEY);
      // };

      // return {
      	
      // };
    }
  ]);
});