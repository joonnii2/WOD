'use strict';
requirejs.config({
    baseUrl: 'scripts',
    paths: {
      angular : '../bower_components/angular/angular.min',
      ionic : '../bower_components/ionic/release/js/ionic',
  		ngAnimate :  '../bower_components/angular-animate/angular-animate',
  		ngSanitize : '../bower_components/angular-sanitize/angular-sanitize',
  		ngUiRouter : '../bower_components/angular-ui-router/release/angular-ui-router',
  		ionicAngular : '../bower_components/ionic/release/js/ionic-angular',
  		ngCordova :  '../bower_components/ngCordova/dist/ng-cordova',
      videoJs : '../bower_components/video.js/dist/video-js/video',
      vjsVideo : '../bower_components/vjs-video/dist/vjs-video.min',
      jQuery : '../bower_components/jquery/dist/jquery.min',
      jQueryUI : '../bower_components/jquery-ui/jquery-ui.min',
      ngMessages : '../bower_components/angular-messages/angular-messages.min',
      commonUtil : 'common'
    },
    shim: {
    	'angular' : {exports:'angular'},
    	'ionic': {deps: ['angular']},
    	'ionicAngular' : {deps: ['ionic']},
    	'app' : {deps : ['angular']},
    	'ngUiRouter' : {deps : ['angular']},
    	'ngCordova' : {deps : ['angular']},
    	'cordova' : {deps : ['ngCordova']},
      'videoJs' : {deps : ['angular']},
      'vjsVideo' : {deps : ['videoJs']},
      'jQueryUI' : {deps : ['jQuery']},
      //'configuration' : {deps : ['angular']},
      'ngMessages' : {deps : ['angular']},
      'commonUtil' : {deps : ['jQuery']}
    },
    deps : ['bootstrap']
});
