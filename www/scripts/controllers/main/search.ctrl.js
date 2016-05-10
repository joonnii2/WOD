define([
  'app'
], function (app) {
  'use strict';

  app.controller('SearchCtrl', [
    'ApiSvc',
    '$scope', 
    '$ionicHistory', 
    '$state',
    '$ionicPlatform',
    function (apiSvc, $scope, $ionicHistory, $state, $ionicPlatform) {
      $scope.idSearchData = {
        username : null,
        phoneFirst : '010',
        phoneMiddle : null,
        phoneLast : null,
        emailId : null,
        emailHost : null,
        birthYear : null,
        birthMonth : null,
        birthDay : null
      };

      $scope.pwSearchData = {
        username : null,
        userid : null,
        phoneFirst : '010',
        phoneMiddle : null,
        phoneLast : null
      }

      $scope.goLogin = function () {
        if (!$ionicHistory.goBack(-1)) {
          $state.go('login');
        };
      };

      $scope.isSearchId = true;

      $scope.yearList = new Array();
      var nowYear = new Date().getFullYear();
      for (var i = (nowYear-10) ; i >= 1940 ; i--) {
        $scope.yearList.push(i);
      };

      $scope.dayList = new Array();
      for (var i = 1 ; i <= 31 ; i++) {
        $scope.dayList.push(i);
      };

      $scope.showIdSearchForm = function() {
        $scope.isSearchId = true;
        jQuery('#pwSearchForm').hide();
        jQuery('#idSearchForm').show();
      };

      $scope.showPwSearchForm = function() {
        $scope.isSearchId = false;
        jQuery('#idSearchForm').hide();
        jQuery('#pwSearchForm').show();
      };

      $scope.idSearch = function (idSearchForm) {
        console.log(idSearchForm);

        if(idSearchForm.$invalid) {
          alert('항목을 모두 빠짐없이 입력해주세요.');
          return false;
        };
        apiSvc.call('doIdSearch', $scope.idSearchData).then(function(res) {
          console.log(res);
          if (res != null && res.data != null) {
            switch ( res.data.flag ) {
              case '1' : 
                console.log('Search OK : ' + res.data.flag);
                alert('회원님의 ID는 '+res.data.id+' 입니다.');
                $state.go('login');
                break;
              case '2' : console.log('Search Fail (인증실패): ' + res.data.flag);
                alert('입력하신 정보로 가입된 회원이 없습니다.');
                break;
              default : console.log('Search Fail (알수없는 오류) : ' + res.data.flag);
                alert('입력하신 정보로 가입된 회원이 없습니다.');
                break;
            }
          }
        });
      };

      $scope.pwSearch = function(pwSearchForm) {
        console.log(pwSearchForm);
        if(pwSearchForm.$invalid) {
          alert('항목을 모두 빠짐없이 입력해주세요.');
          return false;
        }
        apiSvc.call('doPwSearch', $scope.pwSearchData).then(function(res) {
          console.log(res);
          if (res != null && res.data != null) {
            switch ( res.data.flag ) {
              case '1' : 
                console.log('Search OK : ' + res.data.flag);
                alert('회원님 휴대전화로 초기화된 비밀번호를 보내드렸습니다.로그인 후 반드시 비밀번호를 변경해 주세요.');
                $state.go('login');
                break;
              case '2' : console.log('Search Fail (인증실패): ' + res.data.flag);
                alert('입력하신 정보로 가입된 회원이 없습니다.');
                break;
              default : console.log('Search Fail (알수없는 오류) : ' + res.data.flag);
                alert('입력하신 정보로 가입된 회원이 없습니다.');
                break;
            }
          }
        });
      };
    }
  ]);
});