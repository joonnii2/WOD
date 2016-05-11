define([
  'app'
], function (app) {
  'use strict';

  app.controller('CourseCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$rootScope',
    'ApiSvc',
    function ($scope, $state, $stateParams, $rootScope, apiSvc) {

      $scope.doRefresh = function() {
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.onPulling = function() {
        console.log('onPulling... actions here...');
        if ($state.current.name == 'myclass.ingCourseList') {
          doIngCourseList();
        } else if ($state.current.name == 'myclass.ingCourseDetail') {
          doIngCourseDetail($stateParams);
        }
      };

      // 수강중인 강의 > 강의 목록
      if ($state.current.name == 'myclass.ingCourseList') {
        //jQuery('#courseMenu').css('display', 'none');
        jQuery('#courseMenu').hide();
        $rootScope.isShowBackButton = false;
        $scope.courseList = null;
        $scope.examList = null;

        doIngCourseList($stateParams);

      // 수강중인 강의 > 강의 정보
      } else if ($state.current.name == 'myclass.ingCourseDetail') {
        
        doIngCourseDetail($stateParams);
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

      // 강의목록 조회
      function doIngCourseList(param) {
        apiSvc.call('doIngCourseList', param).then(function(res) {
          if (res != null && res.COURSE_LIST != null) {
            console.log('COURSE_LIST received.');
            console.log(res.COURSE_LIST);
            $scope.courseList = res.COURSE_LIST; // 수강중인 온라인 강의 목록
          }
          if (res != null && res.EXAM_LIST != null) {
            console.log('EXAM_LIST received.');
            console.log(res.EXAM_LIST);
            $scope.examList = res.EXAM_LIST; // 온라인 자격시험 목록
          }
        });
      };

      // 강의정보 조회
      function doIngCourseDetail(param) {
        apiSvc.call('doIngCourseDetail', param).then(function(res) {
          // 강의 정보
          if (res != null && res.COURSE_INFO != null) {
            console.log('COURSE_INFO received.');
            console.log(res.COURSE_INFO);
            $scope.courseInfo = res.COURSE_INFO; // 강의정보
          }
          // 학습 현황
          if (res != null && res.STUDY_INFO != null) {
            console.log('STUDY_INFO received.');
            console.log(res.STUDY_INFO);
            $scope.studyInfo = STUDY_INFO; // 학습 현황
          }
          // 성적 조회
          if (res != null && res.STUDY_RESULT != null) {
            console.log('STUDY_RESULT received.');
            console.log(res.STUDY_RESULT);
            $scope.studyResult = STUDY_RESULT; // 성적 조회
          }
        });
      };
    }
  ]);
});
