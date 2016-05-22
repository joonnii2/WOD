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
      
      $scope.lectureName = $stateParams.lectureName;

      // 자격시험 상세
      if ($state.current.name == 'myclass.examDetail') {

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

      // 자격시험 정보
      }else if ($state.current.name == 'myclass.examInfo') {

        // 자격시험 정보 조회
        function doExamInfo() {
          apiSvc.call('doExamInfo', $stateParams).then(function(res) {
            if (res != null && res.DATA != null) {
              console.log('DATA received.');
              console.log(res.DATA);
              $scope.examInfo = res.DATA;
            };
          });
        };

      // 자격시험 응시
      }else if ($state.current.name == 'myclass.examApplication') {

        // 자격시험 응시 정보 조회
        function doExamTake() {
          apiSvc.call('doExamTake', $stateParams).then(function(res) {
            if (res != null && res.LIST != null) {
              console.log('LIST received.');
              console.log(res.LIST);
              $scope.examTake = res.LIST;
            };
          });
        };

      // 자격시험 결과
      }else if ($state.current.name == 'myclass.examResult') {
        // 자격시험 결과 조회
        function doExamResult() {
          apiSvc.call('doExamResult', $stateParams).then(function(res) {
            if (res != null && res.LIST != null) {
              console.log('LIST received.');
              console.log(res.LIST);
              $scope.examTake = res.LIST;
            };
          });
        };

      };


    }
  ]);
});
