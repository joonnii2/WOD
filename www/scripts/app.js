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
    SERVER_URL : 'http://192.168.0.18:8080/',
    //SERVER_URL : 'http://wod.iscu.ac.kr/',
    //API_ENDPOINT:'http://wod.iscu.ac.kr/api', // for Device without Proxy Setting
    API_ENDPOINT:'http://192.168.0.18:8080/api', // for Device without Proxy Setting
    //API_ENDPOINT:'/api', // for Web Browser with Ionic Proxy Setting
    LOGIN_MAIN : 'myclass.ingCourseList',
    VIEWER_WIDTH : '1000',
    VIEWER_HEIGHT : '600',
    VIEWER_DEFAULT_POSTER : '',
    VIEWER_DEFAULT_SAVE_TERM : '180',
    LOCAL_SETTING_KEY : 'WOD_APP_SETTING',
    LOCAL_TOKEN_KEY : 'WOD_SESSION_INFO',
    ENABLE_CONN_GB : [
      '0001', // 동영상 파일
      '0002', // 동영상 CDN
      //'0003', // 음성 파일
      '0004', // 오디오 CDN
      '0008', // 웹 링크 유형
      '0009', // 웹 콘텐츠 유형
      '1009'  // 평가 유형
    ]
  });
  app.config([
    '$sceDelegateProvider', '$ionicConfigProvider', '$httpProvider',
    function($sceDelegateProvider, $ionicConfigProvider, $httpProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
          'self', 
          new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
          'http://youtube.com/**',
          'http://naver.com/**',
          'http://mp4.iscu.ac.kr/**',
          'http://stream.iscu.ac.kr/**',
          'http://192.168.0.19:8080/**',
          'http://192.168.0.18:8080/**',
          'http://wod.iscu.ac.kr/**',
          'http://eval.iscu.ac.kr/**',
          'http://wave.jicsaw.com/**',
          'http://google.co.kr/**',
          'https://google.co.kr/**',
          'http://naver.com/**'
          //new RegExp('^(http[s]?):\/\/(mp4\.)?iscu\.ac\.kr/.+$'),
        ]);
        $sceDelegateProvider.resourceUrlBlacklist([
          'http://myapp.example.com/clickThru**'
        ]);
        $httpProvider.defaults.timeout = 5000;
        // IONIC-TABS Position
        $ionicConfigProvider.tabs.position('bottom');
    }
  ]);
  // return the app so you can require it in other components
  return app;
});
