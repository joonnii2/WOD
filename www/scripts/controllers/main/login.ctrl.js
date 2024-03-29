define([
  'app'
  ,'commonUtil'
], function (app, commonUtil) {
  'use strict';

  app.controller('LoginCtrl', [
    'ApiSvc',
    '$scope', 
    '$ionicHistory', 
    '$state',
    '$ionicPlatform',
    '$rootScope',
    'SessionSvc',
    'ENV',
    '$ionicPopup',
    function (apiSvc, $scope, $ionicHistory, $state, $ionicPlatform, $rootScope, sessionSvc, env, $ionicPopup) {

      var loginMainPage = 'myclass.ingCourseList';
      var platformType = 'Unknown';
      
      function showAlert(msg, goTo) {
        var alertPopup = $ionicPopup.alert({
          title: '알림',
          template: msg,
          okText : '확인',
          okType : 'button-balanced'
        });
        alertPopup.then(function(res) {
          if (goTo != undefined && goTo != '') $state.go(goTo);
        });
      };

      $ionicPlatform.ready(function() {

        commonUtil.bindCheckBox();

        // var deviceInformation = ionic.Platform.device();
        // console.log(deviceInformation);

        // var isWebView = ionic.Platform.isWebView();
        // console.log(isWebView);
        // var isIPad = ionic.Platform.isIPad();
        // console.log(isIPad);
        // var isIOS = ionic.Platform.isIOS();
        // console.log(isIOS);
        // var isAndroid = ionic.Platform.isAndroid();
        // console.log(isAndroid);
        // var isWindowsPhone = ionic.Platform.isWindowsPhone();
        // console.log(isWindowsPhone);

        // var currentPlatform = ionic.Platform.platform();
        // console.log(currentPlatform);
        // var currentPlatformVersion = ionic.Platform.version();
        // console.log(currentPlatformVersion);

        // 앱 정보 조회/체크
        if (ionic.Platform.isWebView()) platformType = 'Web';
        else if (ionic.Platform.isIPad()) platformType = 'IPad';
        else if (ionic.Platform.isIOS()) platformType = 'IOS';
        else if (ionic.Platform.isAndroid()) platformType = 'Android';
        else if (ionic.Platform.isWindowsPhone()) platformType = 'WindowPhone';

        var appData = {
          PLATFORM_NAME : ionic.Platform.platform(),
          PLATFORM_TYPE : platformType,
          PLATFORM_VER : ionic.Platform.version()
        };

        //App 상태 체크
        apiSvc.call('doCheckApplication', appData).then(
          function(res) {
            if (res != null) {
              switch ( res.CODE ) {
                case '0' : 
                  console.log('Application Check : Good !');
                  break;
                default :
                  console.log('Application Check : Fail['+res.CODE+']');
                  // TODO 임시 주석 처리
                  $state.go('message', {messageId : res.CODE, messageData : res.DATA, messageAction : res.ACTION});
                  break;
              }
            }
          },
          function(err) {
            //alert(err);
            //$state.go('message');
            $state.go('message', {messageId : 99, messageData : '서버와 통신중 에러가 발생하였습니다.'});
          }
        );
        
        $scope.loginData = {userid : null, password : null};

        // 로그인
        $scope.login = function(form) {

          // 쿠키 저장 처리
          if ($rootScope.settings.isSaveId) {
            $rootScope.settings.loginData = {
              userid : $scope.loginData.userid,
              password : $scope.loginData.password
            };
          };

          if ($rootScope.settings.isAutoLogin) {
            $rootScope.settings.loginData = $scope.loginData;
          }else {
            // 자동로그인이 아니면 쿠키에 비밀번호 값 저장하지 않음
            // if ($rootScope.settings.loginData != null && $rootScope.settings.loginData.password != null) {
            //   $rootScope.settings.loginData.password = null;
            // };
          };

          window.localStorage.setItem(env.LOCAL_SETTING_KEY, JSON.stringify($rootScope.settings));

          if(!$rootScope.settings.isAutoLogin && form.$invalid) {
            showAlert('아이디/비밀번호를 정확히 입력하세요.');
            return false;
          }

          // 로그인 액선 처리
          apiSvc.call('doLogin', $scope.loginData).then(function(res) {
            console.log(res);
            if (res != null && res.RET_CODE != null) {
              switch ( res.RET_CODE ) {
                case '1' : 
                  console.log('login OK : ' + res.RET_CODE);
                  sessionSvc.setSessionInfo(res.USER_INFO);
                  $state.go(loginMainPage);
                  break;
                case '2' : 
                  console.log('login Fail (ID/PW 인증실패): ' + res.RET_CODE);
                  showAlert('아이디/비밀번호가 일치하지 않습니다.');
                  break;
                default : 
                  console.log('login Fail (알수없는 오류) : ' + res.RET_CODE);
                  showAlert('로그인에 실패하였습니다.');
                  // TODO 임시 로그인 처리
                  // $state.go(loginMainPage);
                  break;
              }
            }
          });
        };
        // 쿠키 로딩
        $rootScope.settings = JSON.parse(window.localStorage.getItem(env.LOCAL_SETTING_KEY) || "{}");

        if ($rootScope.settings.isAutoLogin) {
          jQuery('#autoLogin').parent('label').addClass('on');
          $scope.loginData = $rootScope.settings.loginData;
          $scope.login();
        };

        if ($rootScope.settings.isSaveId) {
          jQuery('#idSave').parent('label').addClass('on');
          if ($rootScope.settings.loginData !=null && $rootScope.settings.loginData.userid != null) {
            $scope.loginData.userid = $rootScope.settings.loginData.userid ;
          };
        };

      });

      // ID/PW 찾기
      $scope.goSearch = function() {
        console.log('ID/PW 찾기');
        $state.go('search');
      };

    }
  ]);
});