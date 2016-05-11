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
    function ($http, $httpParamSerializerJQLike, ENV, $state, sessionSvc) {

      var API_DEFAULT = {
        METHOD : 'POST',
        HEADER : {
                  'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                  //'Content-Type': 'application/json',
                  'Accept': 'application/json, text/plain, */*'
                },
        CREDENTIAL : true
      };

      var DATA_DEFAULT_ORG = {orgCode : sessionSvc.getSessionInfo().userOrgCode, orgSuffixUrl : sessionSvc.getSessionInfo().orgSuffixUrl};
      var DATA_DEFAULT_SESSION = sessionSvc.getSessionInfo();
      var API_SET = {
        // 어플리케이션 유효성 검증
        doCheckApplication : {URL : '/checkApplication.scu', DATA : ENV},
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
        doMainNoticeList : {URL : '/doMainNoticeList.scu', DATA : DATA_DEFAULT_ORG},
        // 공지사항 > 상세 조회
        doMainNoticeDetail : {URL : '/doMainNoticeDetail.scu'},
        // FAQ > 목록 조회
        doFaqList : {URL : '/doFaqList.scu', DATA : DATA_DEFAULT_ORG},
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
        doIngCourseList : {URL : '/doIngCourseList.scu', DATA : DATA_DEFAULT_ORG},
        // 수강중인 강의 > 강의 상세 정보 조회
        doIngCourseDetail : {URL : '/doIngCourseDetail.scu'},
        // 수강중인 강의 > 강의 목록 > 주차 목록 조회
        doTocList : {URL : '/doTocList.scu'},
        // 수강중인 강의 > 강의 목록 > 주차 목록 > 학습목차 목록 조회
        doItemList : {URL : '/doItemList.scu'},
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
        doOrgCodeList : {URL : '/doOrgCodeList.scu'}
      };

      return {
        call : function(apiName, data) {
          if (API_SET[apiName]) {
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

            return $http(req).then(
              function(res) {
                console.log('[' + apiName + '] Response : ' + req.url);
                console.log(res.data);
                return res.data;
              },
              function (err) {

                // TODO 임시 처리
                // if (apiName == 'doCheckApplication') {
                //     return {CODE:'0'};
                // }else if (apiName == 'doLogin') {
                //     return {RET_CODE:'1', USER_INFO : {userId : 'admin'}};
                // };

                // TODO 임시 주석 처리
                console.log('[' + apiName + '] Error : ' + req.url);
                console.log(err.data);
                $state.go('message', {messageId : 99, messageData : '서버와 통신중 에러가 발생하였습니다. 네트워크 상태를 확인하시기 바랍니다.'});
                throw err.status + ' : ' + err.data;
              }
            );
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
        }
      };
    }
  ]);
});
