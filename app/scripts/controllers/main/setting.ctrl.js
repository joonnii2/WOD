define([
  'app'
], function (app) {
  'use strict';

  app.controller('SettingCtrl', [
    '$scope', '$rootScope', '$ionicModal', 'ApiSvc', 'ENV',
    function ($scope, $rootScope, $ionicModal, apiSvc, env) {
        $rootScope.settings = JSON.parse(window.localStorage.getItem(env.LOCAL_SETTING_KEY) || "{}");

        $scope.changeOption = function(optionName) {
          if (optionName == 'isAutoLogin') {
            if ($rootScope.settings.isAutoLogin) $scope.showModal();
            else {
              $scope.beforeAutoLoginStatus = !$rootScope.settings.isAutoLogin;
              window.localStorage.setItem(env.LOCAL_SETTING_KEY, JSON.stringify($rootScope.settings));
            }
          }else if (optionName == 'isSaveId') {
            window.localStorage.setItem(env.LOCAL_SETTING_KEY, JSON.stringify($rootScope.settings));
          }else if (optionName == 'isAutoPlay') {
            if ($rootScope.settings.isAutoPlay) $rootScope.settings.autoPlay = 'autoplay';
            else $rootScope.settings.autoPlay = '';
            window.localStorage.setItem(env.LOCAL_SETTING_KEY, JSON.stringify($rootScope.settings));
          };
        };

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/main/settingLogin.html', {
          scope: $scope,
          cache : false
        }).then(function(modal) {
          $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        // Open the login modal
        $scope.showModal = function() {
          $scope.modal.show();
        };

        $scope.loginData = {userid : null, password : null};

        // Perform the login action when the user submits the login form
        $scope.doUserValidation = function() {

          if ($scope.loginData.userid == undefined || $scope.loginData.userid == null) 
            alert('아이디를 입력하세요.');
          if ($scope.loginData.password == undefined || $scope.loginData.password == null)
            alert('비밀번호를 입력하세요.');

          // 사용자 인증 액선 처리
          apiSvc.call('doCheckUser', $scope.loginData).then(function(res) {
            console.log(res);
            if (res != null && res.RET_CODE != null) {
              switch ( res.RET_CODE ) {
                case '1' : 
                  console.log('Check OK : ' + res.RET_CODE);
                  $rootScope.settings.loginData = $scope.loginData;
                  window.localStorage.setItem(env.LOCAL_SETTING_KEY, JSON.stringify($rootScope.settings));
                  $scope.closeModal();
                  break;
                case '2' : 
                  $rootScope.settings.isAutoLogin = $scope.beforeAutoLoginStatus;
                  window.localStorage.setItem(env.LOCAL_SETTING_KEY, JSON.stringify($rootScope.settings));
                  console.log('Check Fail (ID/PW 인증실패): ' + res.RET_CODE);
                  alert('아이디/비밀번호가 일치하지 않습니다.');
                  break;
                default : 
                  $rootScope.settings.isAutoLogin = $scope.beforeAutoLoginStatus;
                  window.localStorage.setItem(env.LOCAL_SETTING_KEY, JSON.stringify($rootScope.settings));
                  console.log('Check Fail (알수없는 오류) : ' + res.RET_CODE);
                  alert('인증에 실패하였습니다.');
                  break;
              };
            };
          });
        };
    }
  ]);
});
