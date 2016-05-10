define([
  'app'
], function (app) {
  'use strict';

  app.controller('HomeCtrl', [
    '$scope', '$ionicHistory', 
    function ($scope, $ionicHistory) {
    	console.log('HomeCtrl');
    }
  ]);
});
