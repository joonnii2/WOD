define([
  'app'
], function (app) {
  'use strict';

  app.controller('ExamCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$rootScope',
    'ApiSvc',
    function ($scope, $state, $stateParams, $rootScope, apiSvc) {
      console.log('examCtrl');
    	if ($state.current.name == 'myclass.examDetail') {
        console.log('myclass.examDetail');
        console.log(JSON.stringify($stateParams));

        $scope.goExamInfo = function() {
          $state.go('myclass.examInfo', $stateParams);
        };
        
        $scope.goExamApplication = function(param) {
          $state.go('myclass.examApplication', $stateParams);
        };

        $scope.goExamResult = function () {
          $state.go('myclass.examResult', $stateParams);
        };
        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(group) {
          if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
          } else {
            $scope.shownGroup = group;
          }
        };
        $scope.isGroupShown = function(group) {
          return $scope.shownGroup === group;
        };
      };


    }
  ]);
});
