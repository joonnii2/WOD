// The main app definition
// --> where you should load other module depdendencies
define([
	//'angular'
	'ionic'
	,'ngAnimate'
	,'ngSanitize'
	,'ngUiRouter'
	,'ionicAngular'
	,'ngCordova'
  ,'jQuery'
  ,'jQueryUI'
  ,'ngMessages'
  // ,'configuration'
], function () {
  'use strict';
  // the app with its used plugins
  var app = angular.module('app', [
    'ionic',
    'ngCordova',
    'ngMessages'
  ]);

  app.constant('ENV', {
    APP_NAME : 'SCU_WOD',
    APP_VER : '0.0.1',
    CHECK_URL : '/checkApplication.scu',
    //API_ENDPOINT:'http://wod.iscu.ac.kr/api', // for Device without Proxy Setting
    API_ENDPOINT:'http://192.168.0.18:8080/api', // for Device without Proxy Setting
    //API_ENDPOINT:'/api', // for Web Browser with Ionic Proxy Setting
    LOGIN_MAIN : 'myclass.ingCourseList',
    VIEWER_WIDTH : '600',
    VIEWER_HEIGHT : '400',
    VIDWER_DEFAULT_POSTER : '',
    LOCAL_SETTING_KEY : 'WOD_APP_SETTING',
    LOCAL_TOKEN_KEY : 'WOD_SESSION_INFO'
  });
  app.config([
    '$sceDelegateProvider', '$ionicConfigProvider',
    function($sceDelegateProvider, $ionicConfigProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
          'self', 
          new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
          'http://youtube.com/**',
          'http://naver.com/**',
          'http://mp4.iscu.ac.kr/**',
          'http://stream.iscu.ac.kr/**',
          'http://192.168.0.19:8080/**',
          'http://wod.iscu.ac.kr/**',
          'http://eval.iscu.ac.kr/**',
          'http://wave.jicsaw.com/**'
          //new RegExp('^(http[s]?):\/\/(mp4\.)?iscu\.ac\.kr/.+$'),
        ]);
        $sceDelegateProvider.resourceUrlBlacklist([
          'http://myapp.example.com/clickThru**'
        ]);
        
        // IONIC-TABS Position
        $ionicConfigProvider.tabs.position('bottom');
    }
  ]);
  // return the app so you can require it in other components
  return app;
});
