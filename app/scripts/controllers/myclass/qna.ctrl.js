define([
  'app'
], function (app) {
  'use strict';

  app.controller('QnaCtrl', [
    '$scope',
    '$rootScope',
    'ApiSvc',
    '$state',
    '$stateParams',
    function ($scope, $rootScope, apiSvc, $state, $stateParams) {

    	$scope.doRefresh = function() {
    		console.log('doRefresh... ');
    	};

    	$scope.onPulling = function() {
    		console.log('onPulling... actions here...');
    	};
  $scope.items = [{
      title: '상담제목',
      text: '가나다라마바사아자차카타파하 안녕하세요.... 공지사항입니다. 내용이 좀 깁니다.'
    },{
      title: '상담제목',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '상담제목',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '상담제목',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '상담제목',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit'
  }];
      /**
       * 서버 호출 Action
       */
      // Q&A 목록 조회
      function doCourseQnaList(param) {
        apiSvc.call('doCourseQnaList', param).then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            $scope.courseQnaList = res.LIST;
          }
        });
      };
      // Q&A 상세 조회
      function doCourseQnaDetail(param) {
        apiSvc.call('doCourseQnaDetail', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
            $scope.courseQnaDetail = res.DATA;
          }
        });
      };
      // Q&A 등록
      function doCourseQnaWrite(param) {
        apiSvc.call('doCourseQnaWrite', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          }
        });
      };
      // Q&A 수정
      function doCourseQnaModify(param) {
        apiSvc.call('doCourseQnaModify', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          }
        });
      };
      // Q&A 삭제
      function doCourseQnaDelete(param) {
        apiSvc.call('doCourseQnaDelete', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          }
        });
      };

      /**
       * 각 화면별 Action
       */
      // Q&A 목록 조회
      if ($state.current.name == 'myclass.qnaList') {
        
        doCourseQnaList($stateParams);

        // TODO 임시 데이터
$scope.courseQnaList = $scope.items;

        $scope.goWrite = function () {
          $state.go('myclass.qnaWrite', $stateParams);
        };

        $scope.goDetail = function (param) {
          $stateParams.qnaId = param;
          $state.go('myclass.qnaDetail', $stateParams);
        }
      } else if ($state.current.name == 'myclass.qnaDetail') {

        doCourseQnaDetail($stateParams);
        
        // Q&A 수정 폼 이동
        $scope.goModify = function() {
          $state.go('myclass.qnaModify', $stateParams);
        };

        // Q&A 삭제
        $scope.doDelete = function() {
          if (confirm('글을 삭제하시겠습니까?')) {
            doCourseQnaDelete($stateParams);
          };
        };

      } else if ($state.current.name == 'myclass.qnaWrite') {
       
        // Q&A 글 등록
        $scope.doRegist = function() {
          if (confirm('글을 등록하시겠습니까?')) {
            doCourseQnaWrite($stateParams);
          };
        };

        $scope.doCancel = function () {
          if (confirm('취소 하시겠습니까?')) {
            $state.go('myclass.qnaList', $stateParams);
          };
        };
      } else if ($state.current.name == 'myclass.qnaModify') {
        // Q&A 글 수정
        $scope.doModify = function() {
          if (confirm('글을 수정하시겠습니까?')) {
            doCourseQnaModify($stateParams);
          };
        };

        $scope.doCancel = function () {
          if (confirm('취소 하시겠습니까?')) {
            $state.go('myclass.qnaDetail', $stateParams);
          };
        };
      }
 





  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleItem= function(qna) {
    if ($scope.isItemShown(qna)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = qna;
    }
  };
  $scope.isItemShown = function(qna) {
    return $scope.shownItem === qna;
  };

    }
  ]);
});
