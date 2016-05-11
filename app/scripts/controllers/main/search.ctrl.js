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
    '$ionicPopup',
    function (apiSvc, $scope, $ionicHistory, $state, $ionicPlatform, $ionicPopup) {
      $scope.idSearchData = {
        mbrName : null,
        phoneFirst : '010',
        phoneMiddle : null,
        phoneLast : null,
        orgSuffixUrl : null,
        birthYear : null,
        birthMonth : null,
        birthDay : null,
        hp : null,
        birdt : null
      };

      $scope.pwSearchData = {
        mbrName : null,
        mbrId : null,
        orgSuffixUrl : null,
        phoneFirst : '010',
        phoneMiddle : null,
        phoneLast : null,
        hp : null
      }

      $scope.goLogin = function () {
        if (!$ionicHistory.goBack(-1)) {
          $state.go('login');
        };
      };

      $scope.isSearchId = true;

      $scope.yearList = new Array();
      var nowYear = new Date().getFullYear();
      for (var i = nowYear ; i >= 1940 ; i--) {
        $scope.yearList.push(i);
      };

      $scope.dayList = new Array();
      for (var i = 1 ; i <= 31 ; i++) {
        var d = '';
        if (i < 10) d = '0'+i;
        else d = ''+i; 
        $scope.dayList.push(d);
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

      // 사이트코드 조회
      apiSvc.call('doOrgCodeList').then(function(res) {
        if (res != null && res.orgCodeList != null) {
          $scope.orgCodeList = res.orgCodeList;
        };
      });

      // ID 찾기
      $scope.idSearch = function (idSearchForm) {
        console.log(idSearchForm);

        if(idSearchForm.$invalid) {
          showAlert('항목을 모두 빠짐없이 입력해주세요.');
          return false;
        };

        $scope.idSearchData.hp = $scope.idSearchData.phoneFirst + '-' + $scope.idSearchData.phoneMiddle + '-' + $scope.idSearchData.phoneLast;
        $scope.idSearchData.birdt = $scope.idSearchData.birthYear + $scope.idSearchData.birthMonth + $scope.idSearchData.birthDay;

        apiSvc.call('doIdSearch', $scope.idSearchData).then(function(res) {
          console.log(res);
          if (res != null) {
            switch ( res.flag ) {
              case '1' : 
                console.log('Search OK : ' + res.flag);
                showAlert('회원님의 ID는 '+res.mbrId+' 입니다.', 'login');
                break;
              case '2' : console.log('Search Fail (인증실패): ' + res.flag);
                showAlert('입력하신 정보로 가입된 회원이 없습니다.');
                break;
              default : console.log('Search Fail (알수없는 오류) : ' + res.flag);
                showAlert('조회요청에 실패하였습니다.');
                break;
            }
          }
        });
      };

      // 비밀번호 찾기
      $scope.pwSearch = function(pwSearchForm) {
        console.log(pwSearchForm);
        if(pwSearchForm.$invalid) {
          showAlert('항목을 모두 빠짐없이 입력해주세요.');
          return false;
        }

        $scope.pwSearchData.hp = $scope.pwSearchData.phoneFirst + '-' + $scope.pwSearchData.phoneMiddle + '-' + $scope.pwSearchData.phoneLast;

        apiSvc.call('doPwSearch', $scope.pwSearchData).then(function(res) {
          console.log(res);
          if (res != null) {
            switch ( res.flag ) {
              case '1' : 
                console.log('Search OK : ' + res.flag);
                showAlert('회원님 휴대전화로 초기화된 비밀번호를 보내드렸습니다.로그인 후 반드시 비밀번호를 변경해 주세요.', 'login');
                break;
              case '2' : console.log('Search Fail (인증실패): ' + res.flag);
                showAlert('입력하신 정보로 가입된 회원이 없습니다.');
                break;
              default : console.log('Search Fail (알수없는 오류) : ' + res.flag);
                showAlert('조회요청에 실패하였습니다.');
                break;
            }
          }
        });
      };

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
    }
  ]);
});