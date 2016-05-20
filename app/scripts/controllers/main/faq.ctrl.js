define([
  'app'
], function (app) {
  'use strict';

  app.controller('FaqCtrl', [
    '$scope',
    'ApiSvc',
    '$ionicPlatform',
    function ($scope, apiSvc, $ionicPlatform) {
      $ionicPlatform.ready(function() {

        getFaqList();
      	
        $scope.doRefresh = function() {
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
      	};

      	$scope.onPulling = function() {
          getFaqList();
      	};

        $scope.faqQuesGbList = null;
        $scope.faqList = null;

        $scope.getFaqQuesGbName = function(faqQuesGb) {
          var name = null;
          for (var i = 0 ; i < $scope.faqQuesGbList.length ; i++) {
            if ($scope.faqQuesGbList[i].commCode == faqQuesGb) {
              name = $scope.faqQuesGbList[i].userCodeNm;
              break;
            };
          };
          return name;
        };

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

        // FAQ 목록
        function getFaqList() {
          apiSvc.call('doFaqList').then(function(res) {
            if (res != null) {
              if (res.faqQuesGbList != null) $scope.faqQuesGbList = res.faqQuesGbList;
              if (res.LIST != null) $scope.faqList = res.LIST;
            };
          });
        };
      });
    }
  ]);
});
