define([
  'app'
  ,'services/util/asterisk.filter'
  ,'services/util/dateFormat.filter' 
], function (app) {
  'use strict';

  app.controller('NoticeCtrl', [
    '$scope',
    'ApiSvc',
    '$state',
    '$stateParams',
    '$sce',
    'ENV',
    '$ionicPlatform',
    '$ionicTabsDelegate',
    function ($scope, apiSvc, $state, $stateParams, $sce, env, $ionicPlatform, $ionicTabsDelegate) {
      $ionicPlatform.ready(function() {
        $ionicTabsDelegate.select(1); // 강의실 상단 탭 순번 지정
        $scope.baseUrl = env.SERVER_URL;
        if ($state.current.name == 'myclass.noticeList') {

          $scope.totalCnt = 0;
          $scope.stickyList = null;
          $scope.noticeList = null;
          $scope.pageIndex = 1;
          $scope.listCount = 10;
          $scope.totalPage = 1;
          $scope.noMoreItemsAvailable = false;
          $scope.isLoading = false;

          doCourseNoticeList();

          $scope.loadMore = function () {
            if (!$scope.isLoading) {
              if ($scope.pageIndex < $scope.totalPage) {
                $scope.noMoreItemsAvailable = false;
                $scope.pageIndex ++;
                doCourseNoticeList();
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
            doCourseNoticeList();
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
        }else if ($state.current.name == 'myclass.noticeDetail') {
          doCourseNoticeDetail($stateParams);
        };

        // 공지사항 목록
        function doCourseNoticeList() {
          $stateParams.pageIndex = $scope.pageIndex;
          $stateParams.listCount = $scope.listCount;
          $scope.isLoading = true;
          apiSvc.call('doCourseNoticeList', $stateParams).then(function(res) {
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
        function doCourseNoticeDetail(param) {
          apiSvc.call('doCourseNoticeDetail', param).then(function(res) {
            if (res != null && res.DATA != null) {
              console.log('DATA received.');
              console.log(res.DATA);
              $scope.courseNoticeDetail = res.DATA;
            };
          });
        };
  
        $scope.fileDownloadUrl = function(system, key, filePath, fileSaveName, fileOriginName) {
          var url = env.SERVER_URL + system + '/file/download.scu?_fdKey_='+key+'&_fdSubPath_='+filePath+'&_fdFileName_='+fileSaveName+'&_fdFileOriName_='+fileOriginName;
          window.open(url, '_system');
        };


        $scope.fileDownload = function (system, key, filePath, fileSaveName, fileOriginName) {
          var downloadUrl = encodeURI(cordova.file.dataDirectory + fileOriginName);
          var hostUrl = encodeURI(env.SERVER_URL + system + '/file/download.scu?_fdKey_='+key+'&_fdSubPath_='+filePath+'&_fdFileName_='+fileSaveName+'&_fdFileOriName_='+fileOriginName);
          var fileTransfer = new FileTransfer();
          fileTransfer.download(
            hostUrl,
            downloadUrl,
            function(entry) {
              alert('다운로드를 완료하였습니다.');
            },
            function(error) {
              alert('파일을 다운로드할 수 없습니다.');
            },
            true
          );

        };
      });

    }
  ]);
});
