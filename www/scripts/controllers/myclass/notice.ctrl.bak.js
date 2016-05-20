define([
  'app'
], function (app) {
  'use strict';

  app.controller('NoticeCtrl', [
    '$scope', '$rootScope', 'ApiSvc', '$state', '$stateParams',
    function ($scope, $rootScope, apiSvc, $state, $stateParams) {
      // $rootScope.isShowBackButton = true;
      // console.log('run notice.ctrl : '+$rootScope.showList);
      // jQuery('#courseMenu').show();

    	$scope.doRefresh = function() {
    		console.log('doRefresh... ');
    	};

    	$scope.onPulling = function() {
    		console.log('onPulling... actions here...');
    	};

      // 온라인 강의 공지사항 목록 조회
      function doCourseNoticeList(param) {
        apiSvc.call('doCourseNoticeList', param).then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            $scope.courseNoticeList = res.LIST;
          }
        });
//TODO 샘플
  $scope.items = [{
      title: '[필독] 공지사항',
      text: '가나다라마바사아자차카타파하 안녕하세요.... 공지사항입니다. 내용이 좀 깁니다.공지사항입니다. 내용이 좀 깁니다.공지사항입니다. 내용이 좀 깁니다.'
    },{
      title: '[필독] 공지사항',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '[필독] 공지사항',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '[필독] 공지사항',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '[필독] 공지사항',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit'
  }];
  $scope.courseNoticeList = $scope.items;
      };

      // 온라인 강의 공지사항 상세 조회
      function doCourseNoticeDetail(param) {
        apiSvc.call('doCourseNoticeDetail', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
            $scope.courseNoticeDetail = res.DATA; 
          }
        });
      };

      if ($state.current.name == 'myclass.noticeList') {
        doCourseNoticeList($stateParams);
      }else if ($state.current.name == 'myclass.noticeDetail') {
        doCourseNoticeDetail($stateParams);
      };




  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleItem= function(notice) {
    if ($scope.isItemShown(notice)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = notice;
    }
  };
  $scope.isItemShown = function(notice) {
    return $scope.shownItem === notice;
  };
    }
  ]);
});
