define([
  'app'
], function (app) {
  'use strict';

  app.controller('MessageCtrl', [
    '$scope', '$ionicHistory', '$stateParams', '$state',
    function ($scope, $ionicHistory, $stateParams, $state) {
    	console.log('MessageCtrl');
    	console.log('$stateParams : '+JSON.stringify($stateParams));

        $scope.msg = {
            0 : '',
            1 : '어플리케이션을 최신 버전으로 업데이트하시기 바랍니다.',
            2 : '서버와 통신중 일시적인 장애가 발생했습니다. 잠시 후 다시 시도해 주시기 바랍니다.',
            3 : '어플리케이션 검증중 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주시기 바랍니다.',
            4 : '어플리케이션을 검증할 수 없습니다. 최신 버전으로 업데이트후 사용하시기 바랍니다.',
            99 : '서버와 통신중 에러가 발생하였습니다.'
        };

        $scope.act = {
            1 : '홈버튼',
            2 : '홈,다시시도',
            3 : '홈,다음',
            4 : '이전,홈,다음',
            0 : '버튼없음'
        }

    	$scope.messageId = 0;

        if ($stateParams.messageId) $scope.messageId = $stateParams.messageId;
        if ($stateParams.messageData) $scope.msg[$scope.messageId] = $stateParams.messageData;

    	$scope.goToHome = function() {
            
    	};

    	$scope.retry = function() {
            
    	};
    }
  ]);
});
