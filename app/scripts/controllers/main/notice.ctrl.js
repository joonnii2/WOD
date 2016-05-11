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

      if ($state.current.name == 'main.noticeList') {

        doMainNoticeList($stateParams);

        $scope.doRefresh = function() {
          $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.onPulling = function() {
          console.log('onPulling... actions here...');
          doMainNoticeList($stateParams);
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
      }else if ($state.current.name == 'main.noticeDetail') {
        doMainNoticeDetail($stateParams);
      };

      // 공지사항 목록
      function doMainNoticeList() {
        apiSvc.call('doMainNoticeList').then(function(res) {
          if (res != null) {
            if (res.totalCount != null) $scope.totalCount = res.totalCount;
            if (res.stickyList != null) $scope.stickyList = res.stickyList;
            if (res.noticeList != null) $scope.noticeList = res.noticeList;
            console.log('LIST received.');
            //$scope.mainNoticeList = res.LIST;
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

    }
  ]);
});
