define([
  'app'
], function (app) {
  'use strict';

  app.controller('TocCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$rootScope',
    'ApiSvc',
    function ($scope, $state, $stateParams, $rootScope, apiSvc) {
      $scope.doRefresh = function() {
        console.log('doRefresh... ');
      };

      $scope.onPulling = function() {
        console.log('onPulling... actions here...');
      };


      // 주차 목록 조회
      function doTocList(param) {
        apiSvc.call('doTocList', param).then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            $scope.tocList = res.LIST; // 주차 목록
          }
        });
      };

      // 학습목차 목록 조회
      function doItemList(param) {
        apiSvc.call('doItemList', param).then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            $scope.itemList = res.LIST; // 학습목차 목록
          }
        });
      };

      // 학습목차 상세 조회
      function doItemDetail(param) {
        apiSvc.call('doItemDetail', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
            $scope.itemDetail = res.DATA; // 학습목차 상세 정보
          }
        });
      };

      if ($state.current.name == 'myclass.tocList') {

        doTocList($stateParams);

        // $scope.groups = [];

        // for (var i=0; i<10; i++) {
        //   $scope.groups[i] = {
        //     name: (i+1)+' 주차 : ',
        //     items: []
        //   };
        //   for (var j=0; j<3; j++) {
        //     $scope.groups[i].items.push('학습목차 -' + (j+1));
        //   }
        // }
        
        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(toc) {
          if ($scope.isGroupShown(toc)) {
            $scope.shownGroup = null;
          } else {
            $scope.shownGroup = toc;
          }
        };
        $scope.isGroupShown = function(toc) {
          
          doItemList(toc.Id);

          return $scope.shownGroup === toc;
        };



        $scope.goItemDetail = function(itemId, type, examId) {
          $stateParams.itemId = itemId;
          $stateParams.type = type;

          $state.go('myclass.itemDetail', $stateParams);
        };
      }else if ($state.current.name == 'myclass.itemDetail') {
        console.log('$stateParams.type:'+$stateParams.type);
        if ($stateParams.type == 'CONTENTS' || $stateParams.type == 'EXAM') {
          jQuery('.btn_area').show();
        }else {
          jQuery('.btn_area').hide();
        };
        doItemDetail($stateParams);
        $scope.goStudy = function() {
          //'2','https://www.youtube.com/embed/4iHlfXHnN94?autoplay=1'
          if ($scope.itemDetail != null) {
            $stateParams.itemId = $scope.itemDetail.itemId;
            $stateParams.contentsUrl = $scope.itemDetail.contentsUrl;
            $stateParams.width = $scope.itemDetail.width;
            $stateParams.height = $scope.itemDetail.height;
            $stateParams.poster = $scope.itemDetail.poster;
          }
                // TODO 임시 테스트 - SCU 웹콘텐츠
          // $stateParams.itemId = 2;
          // $stateParams.contentsType = 'WEB';
          // $stateParams.contentsUrl = 'http://stream.iscu.ac.kr/stream/Contents/IC0409/1/IC0409_1_1.asp';
          // //$stateParams.contentsUrl = 'http://192.168.0.19:8080/edu.scu';
          // //$stateParams.contentsUrl = 'http://wod.iscu.ac.kr/edu.scu';
          // $stateParams.width = '560';
          // $stateParams.height = '315';
          // $stateParams.poster = 'http://vjs.zencdn.net/v/oceans.png';
          
          
          //     // TODO 임시 테스트 - 유튜브동영상
          // $stateParams.itemId = 2;
          // $stateParams.contentsType = 'URL';
          // $stateParams.contentsUrl = 'https://www.youtube.com/embed/4iHlfXHnN94?autoplay=1';
          // $stateParams.width = '560';
          // $stateParams.height = '315';
          // $stateParams.poster = 'http://vjs.zencdn.net/v/oceans.png';

          


          // TODO 임시 테스트 - SCU 동영상
          $stateParams.itemId = 2;
          $stateParams.contentsType = 'VIDEO';
          $stateParams.contentsUrl = 'http://mp4.iscu.ac.kr/iscu/Contents/13110001/289778/1028548/13110001_1_01.mp4';
          $stateParams.width = '1080';
          $stateParams.height = '920';
          $stateParams.poster = 'http://vjs.zencdn.net/v/oceans.png';

          $state.go('myclass.learningPlayer', $stateParams);
        };
      };
    }
  ]);
});
