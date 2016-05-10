define([
  'app'
], function (app) {
  'use strict';

  app.controller('CounselingCtrl', [
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
      // Q&A 목록
      function doCounselingList(param) {
        apiSvc.call('doCounselingList', param).then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            $scope.counselingList = res.LIST;
          };
        });
      };
      // Q&A 상세정보 조회
      function doCounselingDetail(param) {
        apiSvc.call('doCounselingDetail', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
            $scope.counselingDetail = res.DATA;
          };
        });
      };
      // Q&A 글쓰기
      function doWriteCounseling(param) {
        apiSvc.call('doWriteCounseling', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          };
        });
      };
      // Q&A 수정
      function doModifyCounseling(param) {
        apiSvc.call('doModifyCounseling', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          };
        });
      };
      // Q&A 삭제
      function doDeleteCounseling(param) {
        apiSvc.call('doDeleteCounseling', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
          };
        });
      };

      if ($state.current.name == 'main.counselingList') {
        doCounselingList($stateParams);
      }else if ($state.current.name == 'main.counselingDetail') {
        doCounselingDetail($stateParams);
      }else if ($state.current.name == 'main.counselingModify') {
        
      };

    }
  ]);
});
