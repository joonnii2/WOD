define([
  'app'
], function (app) {
  'use strict';

  app.controller('CounselingCtrl', [
    '$scope',
    'ApiSvc',
    '$state',
    '$stateParams',
    '$ionicPopup',
    function ($scope, apiSvc, $state, $stateParams, $ionicPopup) {
      

 
      if ($state.current.name == 'main.counselingList') {

        $scope.totalCnt = 0;
        $scope.counselingList = null;
        $scope.pageIndex = 1;
        $scope.listCount = 10;
        $scope.totalPage = 1;
        $scope.noMoreItemsAvailable = false;
        $scope.isLoading = false;

        doCounselingList();

        $scope.loadMore = function () {
          if (!$scope.isLoading) {
            if ($scope.pageIndex < $scope.totalPage) {
              $scope.noMoreItemsAvailable = false;
              $scope.pageIndex ++;
              doCounselingList();
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
          $scope.counselingList = null;
          $scope.pageIndex = 1;
          $scope.totalPage = 1;
          $scope.noMoreItemsAvailable = false;
          doCounselingList();
        };

        // 글쓰기 이동
        $scope.goWrite = function() {
          $state.go('main.counselingWrite', $stateParams);
        };
        // 글조회 이동
        $scope.goDetail = function () {
          $state.go('main.counselingDetail', $stateParams);
        };

      // 나의 문의사항 글 조회
      }else if ($state.current.name == 'main.counselingDetail') {

        doCounselingDetail();
        // 글수정 이동
        $scope.goModify = function() {
          $state.go('main.counselingModify', $stateParams);
        };        
        // 글삭제
        $scope.doDelete = function() {
          var confirmPopup = $ionicPopup.confirm({
            title: '알림',
            template: '글을 삭제하시겠습니까?'
          });
          confirmPopup.then(function(res) { 
            if(res) {
              doDeleteCounseling();
            }
          });
        };
        // 답글작성 이동
        $scope.goReplyWrite = function() {
          $state.go('main.counselingReplyWrite', $stateParams);
        };
        // 답글수정 이동
        $scope.goReplyModify = function() {
          $state.go('main.counselingReplyModify', $stateParams);
        };
        // 답글삭제
        $scope.doReplyDelete = function() {
          var confirmPopup = $ionicPopup.confirm({
            title: '알림',
            template: '답글을 삭제하시겠습니까?'
          });
          confirmPopup.then(function(res) { 
            if(res) {
              doDeleteReplyCounseling();
            }
          });
        };
      // 나의 문의사항 글 수정
      }else if ($state.current.name == 'main.counselingModify') {
        
      // 나의 문의사항 글 쓰기
      }else if ($state.current.name == 'main.counselingWrite') {

      // 나의 문의사항 답글 쓰기
      }else if ($state.current.name == 'main.counselingReplyWrite') {

      // 나의 문의사항 답글 수정
      }else if ($state.current.name == 'main.counselingReplyModify') {
      };

     // 나의 문의사항 목록
      function doCounselingList() {

        $stateParams.pageIndex = $scope.pageIndex;
        $stateParams.listCount = $scope.listCount;
        $scope.isLoading = true;
        apiSvc.call('doCounselingList', $stateParams).then(function(res) {
          if (res != null) {
            if (res.TOTCNT != null) $scope.totalCount = res.TOTCNT;

            $scope.totalPage = parseInt($scope.totalCount/$scope.listCount) + 1;
            if (res.LIST != null) {
              if ($scope.counselingList != null) {
                angular.forEach(res.LIST, function(counseling, idx) {
                  $scope.counselingList.push(counseling);
                });
              }else {
                $scope.counselingList = res.LIST;
              };
            };

            console.log('LIST received.');
          };
        }).finally(function() {
          $scope.isLoading = false;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });

      };
      // 나의 문의사항  상세정보 조회
      function doCounselingDetail() {
        apiSvc.call('doCounselingDetail', $stateParams).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
            $scope.counselingDetail = res.DATA;
          };
        });
      };
      // 나의 문의사항 글쓰기
      function doWriteCounseling() {
        apiSvc.call('doWriteCounseling', $stateParams).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          };
        });
      };
      // 나의 문의사항  수정
      function doModifyCounseling() {
        apiSvc.call('doModifyCounseling', $stateParams).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          };
        });
      };
      // 나의 문의사항  삭제
      function doDeleteCounseling() {
        apiSvc.call('doDeleteCounseling', $stateParams).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          };
        });
      };
      // 나의 문의사항 답글 작성
      function doWriteReplyCounseling() {
      };
      // 나의 문의사항 답글 수정
      function doModifyReplyCounseling() {
      };
      // 나의 문의사항 답글 삭제
      function doDeleteReplyCounseling() {
      };

    }
  ]);
});
