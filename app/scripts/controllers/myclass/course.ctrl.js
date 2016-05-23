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
    '$ionicPlatform',
    '$ionicTabsDelegate',
    function ($scope, $state, $stateParams, $rootScope, apiSvc, $ionicPlatform, $ionicTabsDelegate) {
      $ionicPlatform.ready(function() {
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
          jQuery('#mainHeader').show();//상단 메인 헤더 보임
          jQuery('#courseMenu').hide();
          $rootScope.isShowBackButton = false;
          $scope.courseList = null;
          $scope.examList = null;

          doIngCourseList($stateParams);

          // 학습 목차 정보 페이지로 이동
          $scope.goTocList = function(lectureSeqno, lectureName, mobilePosbYn) {
            $stateParams.lectureSeqno = lectureSeqno;
            $stateParams.lectureName = lectureName;
            $stateParams.mobilePosbYn = mobilePosbYn;
            /*강의실 하위 탭들에서 사용하기 위한 변수 세팅*/
            $rootScope.lectureSeqno = lectureSeqno;
            $rootScope.lectureName = lectureName;
            $rootScope.mobilePosbYn = mobilePosbYn;

            $state.go('myclass.tocList', $stateParams);
          };

          // 사험 상세 페이지로 이동
          $scope.goExamDetail = function(lectureSeqno, lectureName, mobilePosbYn) {
            $stateParams.lectureSeqno = lectureSeqno;
            $stateParams.lectureName = lectureName;
            $stateParams.mobilePosbYn = mobilePosbYn;
            $state.go('myclass.examDetail', $stateParams);
          };
        // 수강중인 강의 > 강의 정보
        } else if ($state.current.name == 'myclass.ingCourseDetail') {
          $ionicTabsDelegate.select(2); // 강의실 상단 탭 순번 지정
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

          apiSvc.call('doIngCourseDetail', param).then(function(res) {
            // 강의 정보
            if (res != null && res.COURSE_INFO != null) {
              console.log('COURSE_INFO received.');
              console.log(res.COURSE_INFO);
              $scope.courseInfo = res.COURSE_INFO; // 강의정보
              $scope.basisList = new Array(0);
              angular.forEach($scope.courseInfo.completeBasisList, function(basis, index) {
                $scope.basisList.push(basis);
              });
            }
            // 학습 현황
            if (res != null && res.STUDY_INFO != null) {
              console.log('STUDY_INFO received.');
              console.log(res.STUDY_INFO);
              $scope.studyInfo = res.STUDY_INFO; // 학습 현황
            }
            // 성적 조회
            if (res != null && res.STUDY_RESULT != null) {
              console.log('STUDY_RESULT received.');
              console.log(res.STUDY_RESULT);
              $scope.studyResult = res.STUDY_RESULT; // 성적 조회
            }
          });
        };
      });
    }
  ]);
});
