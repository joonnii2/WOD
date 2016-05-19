define([
  'app'
  ,'services/util/asterisk.filter'
  ,'services/util/dateFormat.filter' 
], function (app) {
  'use strict';

  app.controller('MainNoticeCtrl', [
    '$scope',
    'ApiSvc',
    '$state',
    '$stateParams',
    '$sce',
    'ENV',
    function ($scope, apiSvc, $state, $stateParams, $sce, env) {
      $scope.baseUrl = env.SERVER_URL;
      if ($state.current.name == 'main.noticeList') {

        $scope.totalCnt = 0;
        $scope.stickyList = null;
        $scope.noticeList = null;
        $scope.pageIndex = 1;
        $scope.listCount = 10;
        $scope.totalPage = 1;
        $scope.noMoreItemsAvailable = false;
        $scope.isLoading = false;

        doMainNoticeList();

        $scope.loadMore = function () {
          if (!$scope.isLoading) {
            if ($scope.pageIndex < $scope.totalPage) {
              $scope.noMoreItemsAvailable = false;
              $scope.pageIndex ++;
              doMainNoticeList();
            }else {
              $scope.noMoreItemsAvailable = true;
            };
            $scope.$broadcast('scroll.infiniteScrollComplete');
          };
        };

        $scope.doRefresh = function() {
        };

        $scope.onPulling = function() {
          console.log('onPulling... actions here...');
          $scope.totalCnt = 0;
          $scope.stickyList = null;
          $scope.noticeList = null;
          $scope.pageIndex = 1;
          $scope.totalPage = 1;
          $scope.noMoreItemsAvailable = false;
          doMainNoticeList();
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
        $stateParams.pageIndex = $scope.pageIndex;
        $stateParams.listCount = $scope.listCount;
        $scope.isLoading = true;
        apiSvc.call('doMainNoticeList', $stateParams).then(function(res) {
          if (res != null) {
            if (res.TOTCNT != null) $scope.totalCount = res.TOTCNT;

            $scope.totalPage = parseInt($scope.totalCount/$scope.listCount) + 1;
            if (res.LIST2 != null) $scope.stickyList = res.LIST2;
            if (res.LIST != null) {
              if ($scope.noticeList != null) {
                angular.forEach(res.LIST, function(notice, idx) {
                  $scope.noticeList.push(notice);
                });
              }else {
                $scope.noticeList = res.LIST;
              };
            };

            angular.forEach($scope.stickyList, function(item, idx) {
              item.cntn = $sce.trustAsHtml(item.cntn);
              console.log(item.cntn);
            });
            console.log('LIST received.');
            //$scope.mainNoticeList = res.LIST;
          };
        }).finally(function() {
          $scope.isLoading = false;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
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
      $scope.fileDownload = function (system, key, filePath, fileSaveName, fileOriginName) {
        console.log('fileDownload...');
//http://192.168.0.18:8080/lms/file/download.scu?_fdKey_=lms.file.bbs.phpath&_fdSubPath_=/&_fdFileName_=fda865d6-349d-403f-92bc-c3a7ae14075a.jpg&_fdFileOriName_=DSCF1143.JPG
        var url = env.SERVER_URL + system + '/file/download.scu?_fdKey_='+key+'&_fdSubPath_='+filePath+'&_fdFileName_='+fileSaveName+'&_fdFileOriName_='+fileOriginName;
        window.open(url);
      };

      $scope.fileDownloadUrl = function(system, key, filePath, fileSaveName, fileOriginName) {
        return env.SERVER_URL + system + '/file/download.scu?_fdKey_='+key+'&_fdSubPath_='+filePath+'&_fdFileName_='+fileSaveName+'&_fdFileOriName_='+fileOriginName;
      };
    }
  ]);
});
