define([
  'app'
], function (app) {
  'use strict';

  app.factory('ApiSvc', [
    '$http',
    '$httpParamSerializerJQLike',
    'ENV',
    '$state',
    'SessionSvc',
    '$ionicPopup',
    '$rootScope',
    '$ionicLoading',
    function ($http, $httpParamSerializerJQLike, ENV, $state, sessionSvc, $ionicPopup, $rootScope, $ionicLoading) {
      
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
      var API_DEFAULT = {
        METHOD : 'POST',
        HEADER : {
                  'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                  //'Content-Type': 'application/json',
                  'Accept': 'application/json, text/plain, */*'
                },
        CREDENTIAL : true
      };

      var API_SET = {
        // 어플리케이션 유효성 검증
        doCheckApplication : {URL : '/checkApplication.scu', DATA : ENV},
        // 어플리케이션 유효성 검증
        doCheckServerSession : {URL : '/doCheckServerSession.scu'},
        // 메인 : 로그인
        doCheckUser : {URL : '/doCheckUser.scu'},
        // 메인 : 로그인
        doLogin : {URL : '/doLogin.scu'},
        // 메인 : 로그아웃
        doLogout : {URL : '/doLogout.scu'},
        // 메인 : ID 찾기
        doIdSearch : {URL : '/doIdSearch.scu'},
        // 메인 : 비밀번호 찾기
        doPwSearch : {URL : '/doPwSearch.scu'},
        // 공지사항 > 목록 조회
        doMainNoticeList : {URL : '/doMainNoticeList.scu'},
        // 공지사항 > 상세 조회
        doMainNoticeDetail : {URL : '/doMainNoticeDetail.scu'},
        // FAQ > 목록 조회
        doFaqList : {URL : '/doFaqList.scu'},
        // 나의 문의사항 > 목록 조회
        doCounselingList : {URL : '/doCounselingList.scu'},
        // 나의 문의사항 > 상세 조회
        doCounselingDetail : {URL : '/doCounselingDetail.scu'},
        // 나의 문의사항 > 글쓰기
        doWriteCounseling : {URL : '/doWriteCounseling.scu'},
        // 나의 문의사항 > 수정
        doModifyCounseling : {URL : '/doModifyCounseling.scu'},
        // 나의 문의사항 > 삭제
        doDeleteCounseling : {URL : '/doDeleteCounseling.scu'},
        // 수강중인 강의 > 강의 목록 조회
        doIngCourseList : {URL : '/doIngCourseList.scu'},
        // 수강중인 강의 > 강의 상세 정보 조회
        doIngCourseDetail : {URL : '/doIngCourseDetail.scu'},
        // 수강중인 강의 > 강의 목록 > 주차 목록 조회
        doTocList : {URL : '/doTocList.scu'},
        // 수강중인 강의 > 강의 목록 > 주차 목록 > 학습목차 목록 > 온라인강의 학습목차 상세정보
        doItemDetail : {URL : '/doItemDetail.scu'},
        // 수강중인 강의 > 강의 목록 > 온라인강의 공지사항 목록 조회
        doCourseNoticeList : {URL : '/doCourseNoticeList.scu'},
        // 수강중인 강의 > 강의 목록 > 온라인강의 공지사항 목록 조회
        doCourseNoticeDetail : {URL : '/doCourseNoticeDetail.scu'},
        // 수강중인 강의 > 강의 목록 > 온라인강의 Q&A 목록 조회
        doCourseQnaList : {URL : '/doCourseQnaList.scu'},
        // 수강중인 강의 > 강의 목록 > 온라인강의 Q&A 상세 정보 조회
        doCourseQnaDetail : {URL : '/doCourseQnaDetail.scu'},
        // 수강중인 강의 > 강의 목록 > 온라인강의 Q&A 글쓰기
        doCourseQnaWrite : {URL : '/doCourseQnaWrite.scu'},
        // 수강중인 강의 > 강의 목록 > 온라인강의 Q&A 수정
        doCourseQnaModify : {URL : '/doCourseQnaModify.scu'},
        // 수강중인 강의 > 강의 목록 > 온라인강의 Q&A 삭제
        doCourseQnaDelete : {URL : '/doCourseQnaDelete.scu'},
        // 수강중인 강의 > 온라인 자격시험 정보
        doExamInfo : {URL : '/doExamInfo.scu'},
        // 수강중인 강의 > 온라인 자격시험 상세
        doExamDetail : {URL : '/doExamDetail.scu'},
        // 수강중인 강의 > 온라인 자격시험 응시
        doExamTake : {URL : '/doExamTake.scu'},
        // 수강중인 강의 > 온라인 자격시험 결과
        doExamResult : {URL : '/doExamResult.scu'},
        // 사이트 목록
        doOrgCodeList : {URL : '/doOrgCodeList.scu'},

        // 학습창 로딩
        doLoadingServiceInfo : {URL : '/doLoadingServiceInfo.scu'},        
        // 학습창 > 학습이력 저장
        doSaveLearnerHistory : {URL : '/doSaveLearnerHistory.scu'}
      };

      return {
        call : function(apiName, data) {

          if (API_SET[apiName]) {
            // Setup the loader
            $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
            });

            if (data == undefined || data == null) {
                data = {orgCode : $rootScope.sessionInfo.userOrgCode, orgSuffixUrl : $rootScope.sessionInfo.orgSuffixUrl};
            }else {
                data = $.extend({orgCode : $rootScope.sessionInfo.userOrgCode, orgSuffixUrl : $rootScope.sessionInfo.orgSuffixUrl}, data);
            }
            var param = function () {
                if (API_SET[apiName].DATA) {
                    if (data) return $httpParamSerializerJQLike($.extend(API_SET[apiName].DATA, data));
                    else return $httpParamSerializerJQLike(API_SET[apiName].DATA);
                }else {
                    return $httpParamSerializerJQLike(data);
                };
            };

            var req = {
                method : API_SET[apiName].METHOD ? API_SET[apiName].METHOD : API_DEFAULT.METHOD,
                url : ENV.API_ENDPOINT + API_SET[apiName].URL,
                headers : API_SET[apiName].HEADER ? API_SET[apiName].HEADER : API_DEFAULT.HEADER,
                //data : API_SET[apiName].DATA ? $httpParamSerializerJQLike($.extend(API_SET[apiName].DATA, data)) : $httpParamSerializerJQLike(data),
                data : param(),
                withCredentials: API_DEFAULT.CREDENTIAL
            };
            console.log('[' + apiName + '] Request : ' + req.url);
            console.log(req);

            // if (this.checkSession(req)) {
                return $http(req).then(
                  function(res) {
                    console.log('==>'+'21');
                    console.log('[' + apiName + '] Response : ' + req.url);
                    console.log(res.data);
                    $ionicLoading.hide();
                    return res.data;
                  },
                  function (err) {
                    console.log('[' + apiName + '] Error : ' + req.url);
                    console.log(err.data);
                    $ionicLoading.hide();
                    $state.go('message', {messageId : 99, messageData : '서버와 통신중 에러가 발생하였습니다. 네트워크 상태를 확인하시기 바랍니다.'});
                    throw err.status + ' : ' + err.data;
                  }
                );
            // };
          }else {

            if (apiName == 'getContents') {
                var req = {
                    method : 'GET',
                    url : data,
                    headers : API_DEFAULT.HEADER
                };
                console.log('[' + apiName + '] Request : ' + req.url);
                console.log(req);

                return $http(req).then(
                  function(res) {
                    console.log('[' + apiName + '] Response : ' + req.url);
                    console.log(res);
                    return res;
                  },
                  function (err) {
                    console.log('[' + apiName + '] Error : ' + req.url);
                    console.log(err.data);
                    throw err.status + ' : ' + err.data;
                  }
                );
            }else {
                console.log('[' + apiName + '] The API not found.');
                return;
            }

          };
        }, 
        checkSession : function(prevReq) {
            // 사용자 세션 체크를 위한 요청 해더
            var req = {
                method : API_SET['doCheckServerSession'].METHOD ? API_SET['doCheckServerSession'].METHOD : API_DEFAULT.METHOD,
                url : ENV.API_ENDPOINT + API_SET['doCheckServerSession'].URL,
                headers : API_SET['doCheckServerSession'].HEADER ? API_SET['doCheckServerSession'].HEADER : API_DEFAULT.HEADER,
                withCredentials: API_DEFAULT.CREDENTIAL
            };

            var returnFlag = false;
            // 사용자 세션 체크 요청
            return $http(req).then(
                // 사용자 세션 체크 응답
                function(res) {
                    console.log('[doCheckServerSession] Response : ' + req.url);
                    console.log(res.data);
                    // 사용자 세션 : 유효함
                    if (res.data != null && res.data.RET_CODE != null && res.data.RET_CODE == '1') {
                        //return true;
                        returnFlag = true;
                    // 사용자 세션 : 만료되었거나 서버 응답이 없을 경우
                    }else {
                        // 쿠키에서 사용자 로그인 정보가 있는지 확인
                        if ($rootScope.settings != undefined && $rootScope.settings.loginData != undefined 
                            && $rootScope.settings.loginData.userid != null && $rootScope.settings.loginData.password != null) {
                            console.log($rootScope.settings.loginData.userid);
                            console.log($rootScope.settings.loginData.password);

                            var confirmPopup = $ionicPopup.confirm({
                                title: '알림',
                                template: '사용자 세션이 만료되었습니다. 다시 연결 하시겠습니까?'
                            });
                            
                            confirmPopup.then(function(res) {
                                // 쿠키에 저장된 사용자 로그인 정보로 재연결 시도
                                if(res) {
                                    // 재로그인 파라미터 설정
                                    var loginParam = function () {
                                        return API_SET['doLogin'].DATA ? $httpParamSerializerJQLike($.extend(API_SET['doLogin'].DATA, $rootScope.settings.loginData)) : $httpParamSerializerJQLike($rootScope.settings.loginData);
                                    };
                                    // 재로그인 해더 설정
                                    var loginReq = {
                                        method : API_SET['doLogin'].METHOD ? API_SET['doLogin'].METHOD : API_DEFAULT.METHOD,
                                        url : ENV.API_ENDPOINT + API_SET['doLogin'].URL,
                                        headers : API_SET['doLogin'].HEADER ? API_SET['doLogin'].HEADER : API_DEFAULT.HEADER,
                                        data : loginParam(),
                                        withCredentials: API_DEFAULT.CREDENTIAL
                                    };
                                    // 재로그인 요청 시도
                                    return $http(loginReq).then(
                                        // 재로그인 요청에 대한 응답
                                        function(loginRes) {
                                            console.log('[Retry doLogin] Response : ' + loginReq.url);
                                            console.log(loginRes.data);
                                            // 재로그인 요청에 대한 응답이 있을 경우
                                            if (loginRes.data != null && loginRes.data.RET_CODE != null) {
                                                switch ( loginRes.data.RET_CODE ) {
                                                    case '1' : // 정상 로그인 처리됨
                                                        console.log('login OK : ' + loginRes.data.RET_CODE);
                                                        sessionSvc.setSessionInfo(loginRes.data.USER_INFO); // 세션 정보 다시 설정
                                                        // 이전 요청에 대한 재 요청 처리
                                                        // $http(prevReq).then(
                                                        //     function(retryRes) {
                                                        //         console.log('==>'+'10');
                                                        //         console.log('[Retry] Response : ' + prevReq.url);
                                                        //         console.log(retryRes.data);
                                                        //         return retryRes.data;
                                                        //     },
                                                        //     function (retryErr) {
                                                        //         console.log('==>'+'11');
                                                        //         console.log('[Retry] Error : ' + prevReq.url);
                                                        //         console.log(retryErr.data);
                                                        //         $state.go('message', {messageId : 99, messageData : '서버와 통신중 에러가 발생하였습니다.[0] 네트워크 상태를 확인하시기 바랍니다.'});
                                                        //         throw retryErr.status + ' : ' + retryErr.data;
                                                        //     }
                                                        // );
                                                        returnFlag = true;
                                                        break;
                                                    default : // 로그인 처리되지 않았을 경우
                                                        console.log('login Fail (알수없는 오류) : ' + loginRes.data.RET_CODE);
                                                        showAlert('사용자 세션 연결에 실패하였습니다.[1]<br/>다시 로그인 후 시도하시기 바랍니다.', 'login');
                                                        break;
                                                };
                                            // 재로그인 요청에 대한 응답 코드가 없을 경우
                                            }else {
                                                showAlert('사용자 세션 연결에 실패하였습니다.[2]<br/>다시 로그인 후 시도하시기 바랍니다.', 'login');
                                            };
                                        },
                                        // 재로그인 요청에 대한 응답 오류
                                        function (loginErr) {
                                            console.log('[Retry doLogin] Error : ' + loginReq.url);
                                            showAlert('서버와 통신중 에러가 발생하였습니다.[3]<br/>네트워크 상태를 확인하시기 바랍니다.('+loginErr.status+')', 'login');
                                            throw loginErr.status + ' : ' + loginErr.data;
                                        }
                                    );
                                // 재연결 하지 않음
                                } else {
                                    sessionSvc.removeSessionInfo(); // 사용자 세션 제거
                                    $state.go('login'); // 로그인 화면으로 이동
                                }
                            });
                        // 쿠키에 사용자 정보가 없을 경우
                        }else {
                            showAlert('사용자 세션이 만료되었습니다.[4]<br/>다시 로그인 후 시도하시기 바랍니다.', 'login');
                            return false;
                        }
                    };
                },
                function (err) {
                    console.log('[doCheckServerSession] Error : ' + req.url);
                    console.log(err);
                    console.log(err.data);
                    $state.go('message', {messageId : 99, messageData : '서버와 통신중 에러가 발생하였습니다.[5] 네트워크 상태를 확인하시기 바랍니다.'});
                    throw err.status + ' : ' + err.data;
                }
            );
            return returnFlag;
        }
      };
    }
  ]);
});
