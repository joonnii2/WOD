define([
  'app'
], function (app) {
  'use strict';

  app.controller('MenuCtrl', [
    'ApiSvc',
    '$scope', 
    '$state',
    '$ionicHistory',
    '$rootScope',
    'ENV',
    'SessionSvc',
    '$stateParams',
    '$ionicTabsDelegate',
    function (apiSvc, $scope, $state, $ionicHistory, $rootScope, env, sessionSvc, $stateParams, $ionicTabsDelegate) {

/*	    var currentHistoryId = $ionicHistory.currentHistoryId();
	    console.log('currentHistoryId : '+currentHistoryId);
	    var history = $ionicHistory.viewHistory();
	    var stack = null;
	    if (history.histories[currentHistoryId] != null && history.histories[currentHistoryId] != undefined)
	    	stack = history.histories[currentHistoryId].stack;

        if (stack != undefined && stack[stack.length-1] != undefined) {
            //$ionicHistory.backView(stack[stack.length-1]);
            jQuery('backBtn').show();
            console.log('stacks not undefined');
	        for (var i = 0; i < stack.length; i += 1) {
	            console.log('stateId : '+stack[i].stateId);
	            if (stack[i].stateId == 'login') {
		        	jQuery('backBtn').hide();
		        	console.log('stacks undefined');

		        	break;
	            };
	        }
        }else {
        	jQuery('backBtn').hide();
        	console.log('stacks undefined');
        };*/
        $scope.userInfo = {
        	userName : sessionSvc.getSessionInfo().userName,
        	userId : sessionSvc.getSessionInfo().userId
        };

		$scope.goBack = function() {
			console.log('goBack...');
	        var s,
	            currentHistoryId = $ionicHistory.currentHistoryId(),
	            history = $ionicHistory.viewHistory(),
	            stack = history.histories[currentHistoryId].stack;

	        for (var s = 0; s < stack.length; s += 1) {
	            console.log('for stateId ['+s+']: '+stack[s].stateId);
	            if (stack[s].stateId == 'myclass.ingCourseList') {

					//jQuery('#courseMenu').css('display', 'none');
					break;
	            };
	        }
	        //$ionicHistory.clearCache();
            $ionicHistory.goBack(-1);
		};

	  	$scope.logout = function() {
	  		if (confirm('Logout 하시겠습니까?')) {
	        	apiSvc.call('doLogout', $scope.loginData).then(function(res) {
	          		console.log(res);
	          		if (res != null && res.RET_CODE != null) {
	            		switch ( res.RET_CODE ) {
	              			case '1' : 
	                			console.log('logout OK : ' + res.RET_CODE);
	                			sessionSvc.removeSessionInfo();
	                			$state.go('login');
	                			break;
	              			case '2' : 
	              				alert('서버에서 로그아웃할 수 없습니다. 잠시후 다시 시도해 주십시요.');
	              				console.log('logout Fail (): ' + res.RET_CODE);
	                			break;
	              			default : 
	              				alert('로그아웃중 문제가 발생하였습니다. 잠시후 다시 시도해 주십시요.');
	              				console.log('logout Fail (알수없는 오류) : ' + res.RET_CODE);
	                			break;
	            		}
	          		}
	        	});
   			};
	  	};
	  	
        $rootScope.lectureSeqno = null;
        $rootScope.lectureName = null;
        $rootScope.mobilePosbYn = null;

        $scope.selectCourseTab = function(idx) {
        	console.log('tab index : '+idx);
        	$ionicTabsDelegate.select(idx);
	  		var param = {
	  			lectureSeqno : $rootScope.lectureSeqno,
	  			lectureName : $rootScope.lectureName,
	  			mobilePosbYn : $rootScope.mobilePosbYn
	  		};
        	switch (idx) {
        		case 0 : $state.go('myclass.tocList', param); break;
        		case 1 : $state.go('myclass.noticeList', {lectureSeqno : $rootScope.lectureSeqno}); break;
        		case 2 : $state.go('myclass.ingCourseDetail', {lectureSeqno : $rootScope.lectureSeqno}); break;
        		case 3 : $state.go('myclass.qnaList', {lectureSeqno : $rootScope.lectureSeqno}); break;
        		default : $state.go('myclass.tocList', param); break;
        	};
        	
        };
    }
  ]);
});
