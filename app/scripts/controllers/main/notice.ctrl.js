define([
  'app'
], function (app) {
  'use strict';

  app.controller('MainNoticeCtrl', [
    '$scope',
    'ApiSvc',
    '$state',
    '$stateParams',
    function ($scope, apiSvc, $state, $stateParams) {
    	
    	$scope.doRefresh = function() {
    		console.log('doRefresh... ');
    	};

    	$scope.onPulling = function() {
    		console.log('onPulling... actions here...');
    	};
      // 공지사항 목록
      function doMainNoticeList() {
        apiSvc.call('doMainNoticeList').then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            $scope.mainNoticeList = res.LIST;
          };
        });
      };
      // 공지사항 상세
      function doMainNoticeDetail(param) {
        apiSvc.call('doMainNoticeDetail', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
            $scope.mainNoticeDetail = res.DATA;
          };
        });
      };

      if ($state.current.name == 'main.noticeList') {
        doMainNoticeList($stateParams);
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
  $scope.mainNoticeList = $scope.items;
  
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
      }else if ($state.current.name == 'main.noticeDetail') {
        doMainNoticeDetail($stateParams);
      };


    }
  ]);
});
