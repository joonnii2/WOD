define([
  'app'
], function (app) {
  'use strict';

  app.controller('ViewerCtrl', [
    '$ionicPlatform',
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    '$sce',
    'ENV',
    '$rootScope',
    '$ionicLoading',
    '$timeout',
    'ApiSvc',
    '$window',
    '$ionicPopup',
    '$cordovaInAppBrowser',
    function ($ionicPlatform, $scope, $state, $stateParams, $ionicHistory, $sce, env, $rootScope, $ionicLoading, $timeout, apiSvc, $window, $ionicPopup, $cordovaInAppBrowser) {
      
      var learningObj = null;
      $scope.isIOS = false;

      $ionicPlatform.ready(function() {

$scope.isIOS = ionic.Platform.isIOS();
console.log('isIOS : '+$scope.isIOS);

        $scope.getCssOrientation = function() {
          if ($scope.viewerOrientation == 'landscape') {
            return 'video-portrait';
          }else {
            return 'video-portrait';
          };
        };

        // Setup the loader
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        //var learningObj = document.getElementById('media');
        $rootScope.settings = JSON.parse($window.localStorage.getItem(env.LOCAL_SETTING_KEY) || "{}");

        /* 학습자 정보 */
        $scope.learner = {
          startTimestamp : null,                        // 학습 시작 시간 - Timestamp
          startTime : null,                             // 학습 시작 시간
          endTimestamp : null,                          // 학습 종료 시간 - Timestamp
          endTime : null,                               // 학습 종료 시간
          lastStartTimestamp : null,                    // 최근 다시 시작한 시간 - Timestamp
          lastStartTime : null,                         // 최근 다시 시작한 시간
          lastPausedTimestamp : null,                   // 최근 일시 중지한 시간 - Timestamp
          lastPausedTime : null,                        // 최근 일시 중지한 시간
          lastLearnTime : 0,                            // 최근 시작/재시작 - 최근 중지/일시중지
          totalLearningTime : 0,                        // 총 학습 시간 (초단위)
          //lastLearnTimeSum : 0,
          isLearningStarted : false,                    // 학습을 시작 했는지 여부
          isLearningEnded : false,                      // 학습이 종료 됬는지 여부
          //lastPosition : 0,                             // 현재 미디어 학습 위치
          actionType : 'unset',                          // 학습자 이력 저장 액션 유형 ('init' : 뷰어시작, 'start' : 학습시작, 'auto' : 자동저장 'pause' : 일시중지, 'resume' : 학습재개, 'stop' : 학습종료, 'exit' : 뷰어종료)
          lectureSeqno : $stateParams.lectureSeqno,     // 강좌 일련번호
          wsSeqno : $stateParams.wsSeqno,               // 주차 일련번호
          tocSeqno : $stateParams.tocSeqno,             // 학습목차 일련번호
          prgssRateCompleteBasis : $stateParams.prgssRateCompleteBasis, // 콘텐츠 완료 기준 진도율
          connGb : $stateParams.connGb,                 // 학습자원 종류
          pobtTypeGb : $stateParams.pobtTypeGb,         // 콘텐츠 이수기준 구분 ('01' : 학습시간, '02' : 학습시작시, '03' : 제출/응시, '04' : 글작성, '05' : 없음)
          viewerRunYn : $stateParams.viewerRunYn,       // 학습창내 실행 여부(학습창/새창 여부)
          tocEdTime : $stateParams.tocEdTime,           // 목차 권장 학습 시간
          serviceYn : null,                             // 학습 이력 저장 가능 여부
          hisSeqno : null,                              // 최근 저장한 학습 이력 ('init' 시 저장된 이력 순번)
          finalLearnPst : null,                         // 미디어 최근 학습 위치
          pobtYn : $stateParams.pobtYn                  // 학습 목차 학습 완료 여부
        };

        /* 학습 아이템 정보 */
        $scope.item = {
          lectureSeqno : $stateParams.lectureSeqno,     // 강좌 일련번호
          wsSeqno : $stateParams.wsSeqno,               // 주차 일련번호
          tocSeqno : $stateParams.tocSeqno,             // 학습목차 일련번호
          connGb : $stateParams.connGb,                 // 학습자원 종류 -------------
          mobileConnPk : $stateParams.mobileConnPk,     // 모바일 리소스 연계 키
          prgssRateCompleteBasis : $stateParams.prgssRateCompleteBasis, // 콘텐츠 완료 기준 진도율
          pobtTypeGb : $stateParams.pobtTypeGb,          // 콘텐츠 이수기준 구분 ('01' : 학습시간, '02' : 학습시작시, '03' : 제출/응시, '04' : 글작성, '05' : 없음)
          viewerRunYn : $stateParams.viewerRunYn,        // 학습창내 실행 여부(학습창/새창 여부)  ----------
          viewerWidthSize : $stateParams.viewerWidthSize ? $stateParams.viewerWidthSize : env.VIEWER_WIDTH,  // 학습창 넓이 -----------
          viewerHgtSize : $stateParams.viewerHgtSize ? $stateParams.viewerHgtSize : env.VIEWER_HEIGHT,// 학습창 높이 -----------
          tocName : $stateParams.tocName,                // 목차타이틀
          tocEdTime : $stateParams.tocEdTime,            // 목차 권장 학습 시간
          saveTerm : null,                               // 학습이력 저장 간격 (초)
          defaultContentsCdn : null,                     // 웹 콘텐츠 기본 경로
          itemDetail : null,                             // 주차의 학습 목차 목록
          resourceList : null,                           // 학습목차에 연결된 학습 자원 목록
          isMedia : false,                               // 미디어인지 여부
          isPlaying : false,                             // 학습중인지 여부
          serviceYn : 'Y',                               // 학습 이력 저장 가능 여부
          viewingYn : 'Y',                               // 학습창 보기 가능 여부
          rscTypeGb : null,                              // 학습자원 유형 ('0001' : 동영상 파일, '0002' : 동영상 CDN, '0003' : 음성파일, '0004' : 음성 CDN, '0008' : 웹링크, '0009' : 웹콘텐츠)
          rscDetailTypeGb : null,                        // 학습자원 상세 유형 ('000001' : 자막 파일)
          rscDetailPath : null,                          // 학습자원 경로
          rscDetailFileName : null,                      // 학습자원 파일명
          cdnUrl : null,                                 // 미디어 스트리밍 CDN URL
          contentsServiceUrl : null,                     // 콘텐츠 서비스 Full URL
          vttYn : null,                                  // 자막 유무
          vttRscDetailPath : null,                       // 기본 자막파일 경로
          vttRscDetailFileName : null,                   // 기본 자막파일 명
          vttLangGb : null,                              // 기본 자막 언어 코드
          vttLangName : null,                            // 기본 자막 언어 명
          vttServiceUrl : null,                          // 자막 서비스 Full URL
          poster : env.VIEWER_DEFAULT_POSTER,            // 미디어 썸네일 이미지
          cpyrtTypeGb : null,                            // 아이템 저작권 타입 ('01' : 저작권 없음, '02' : 저작권 제한기간 있음, '03' : 저작권 제한기간 없음)
          cpyrtStartDt : null,                           // 아이템 저작권 시작일 (yyyymmdd)
          cpyrtEndDt : null,                             // 아이템 저작권 만료일 (yyyymmdd)
          serverDt : null                                // 서버 날짜 (yyyymmdd)
        };
        
        $scope.viewer = {
          counter : 600
        };
        //$scope.webContentsServiceUrl = null;
        //$scope.mediaServiceUrl = null;

        /* 학습 데이터 조회 및 설정 시작*/
        apiSvc.call('doLoadingServiceInfo', $stateParams).then(function(res) {
          if (res != null) {
            //$scope.item.saveTerm = res.SAVE_TERM; TODO 임시 테스트
            $scope.item.saveTerm = 60;
            $scope.viewer.counter = $scope.item.saveTerm;
            $scope.item.defaultContentsCdn = res.DEFAULT_CONTENTS_CDN;
            $scope.item.resourceList = res.RESOURCE_LIST;
            if (res.ITEM_LIST != undefined && res.ITEM_LIST != null) {
              var isBreak = false;
              angular.forEach(res.ITEM_LIST, function(itm, idx){
                if (!isBreak && $scope.item.tocSeqno == itm.tocSeqno) {
                  isBreak = true;
                  $scope.item.itemDetail = itm;
                  $scope.item.finalLearnPst = itm.finalLearnPst;
                  $scope.item.serviceYn = itm.serviceYn;
                  $scope.item.viewingYn = itm.viewingYn;
                  $scope.item.cpyrtTypeGb = itm.cpyrtTypeGb;
                  $scope.item.cpyrtStartDt = itm.cpyrtStartDt;
                  $scope.item.cpyrtEndDt = itm.cpyrtEndDt;
                  $scope.item.serverDt = itm.nowDt;

                  $scope.learner.serviceYn = itm.serviceYn;
                  $scope.learner.finalLearnPst = itm.finalLearnPst;
                };
              });
            };
            // 학습 가능 여부 확인
            if ($scope.item.viewingYn != 'Y') showAlert('학습 가능 기간이 아닙니다.', true);

            // 아이템 저작권 만료 여부 확인
            if ($scope.item.cpyrtTypeGb != null && $scope.item.cpyrtTypeGb == '02') {
              if ($scope.item.cpyrtEndDt != null && $scope.item.serverDt != null) {
                if (parseInt($scope.item.cpyrtStartDt) > parseInt($scope.item.serverDt)) {
                  showAlert('콘텐츠 저작권에 따른 서비스 기간이 아니여서 표시할 수 없습니다.', true);
                };
                if (parseInt($scope.item.cpyrtEndDt) < parseInt($scope.item.serverDt)) {
                  showAlert('콘텐츠 저작권에 따른 서비스 기간이 만료되어 표시할 수 없습니다.', true);
                };
              };
            };

            setResource();  // resourceList로 부터 사용할 콘텐츠 resource 정보 설정
            setContents();  // 학습창에 콘텐츠 로딩
          };
        });
        /* 학습 데이터 조회 및 설정 끝 */

        // 화면 터치
        $scope.onTouch = function() {
          if ($scope.item.isMedia) {
            if (jQuery('#infoPanel').css('display') == 'none') {
              jQuery('#infoPanel').slideDown();
              $timeout(function() {
                jQuery('#infoPanel').slideUp();
              }, 7000, true);
            }else {
              jQuery('#infoPanel').slideUp();
            };
          };
        };



        $scope.showConfirm = function() {
          //$scope.doPauseStudy();
          control.pause();
console.log('exit pause------------------');
          var confirmPopup = $ionicPopup.confirm({
            title: '학습종료',
            template: '학습을 종료하시겠습니까?'
          });
          
          confirmPopup.then(function(res) { 
            if(res) {
console.log('exit confirm------------------');
              //$scope.doExit();
              control.exit();
              
            } else {
              //$scope.doResumeStudy();
console.log('exit cancel------------------');
              control.resume();
            }
          });
        };

        $window.addEventListener("orientationchange", function() {
          switch($window.orientation) {  
            case -90: // 가로모드 landscape

              $scope.viewerOrientation = 'landscape';

              if ($scope.item.isMedia) {
                resizeVideo();
              };
              break;
            case 90: // 가로모드 landscape
              $scope.viewerOrientation = 'landscape';
              if ($scope.item.isMedia) {
                resizeVideo();
              };
              break; 
            case 0: // 세로모드 Portrait
              $scope.viewerOrientation = 'portrait';
              if ($scope.item.isMedia) {
                resizeVideo();
              };
              break; 
            case 180: // 세로모드 Portrait
              $scope.viewerOrientation = 'portrait';
              if ($scope.item.isMedia) {
                resizeVideo();
              };
              break; 
            default: // 세로모드 Portrait
              $scope.viewerOrientation = 'portrait';
              if ($scope.item.isMedia) {
                resizeVideo();
              };
              break; 
          };
        }, false);

        $window.addEventListener("resume", function() {
          control.resume();
        }, false);
        
        $window.addEventListener("pause", function() {
          control.pause();
        }, false);


        
        var mytimeout = null // 현재 timeoutID

        $scope.onTimeout = function() {
          console.log('timer : ' + $scope.viewer.counter);
          if ($scope.viewer.counter === 0) {
            //$scope.$broadcast('timer-stopped', 0);
            //$timeout.cancel(mytimeout);
            // 학습이력 저장
            $scope.learner.actionType = 'auto';
            $scope.learner.lastLearnTime = parseInt($scope.item.saveTerm);
            $scope.learner.totalLearningTime += parseInt($scope.learner.lastLearnTime);
            //$scope.learner.lastLearnTimeSum += parseInt($scope.learner.lastLearnTime);
            
            $scope.viewer.counter = $scope.item.saveTerm;

            apiSvc.call('doSaveLearnerHistory', $scope.learner).then(function(res) {
              console.log('학습이력 저장 호출 : Call Server doSaveLearnerHistory');
              if (res != null && res.pobtYn != null) {
                $scope.learner.pobtYn = res.pobtYn;
              };
            });

            
            //return;
          };
          
          $scope.viewer.counter--;
          mytimeout = $timeout($scope.onTimeout, 1000);
        };

        $scope.startTimer = function(actionType) {
          mytimeout = $timeout($scope.onTimeout, 1000);
          console.log('timer started saveTerm: ' + $scope.item.saveTerm);

          $scope.learner.actionType = actionType;
          $scope.learner.lastLearnTime = 0;
          //$scope.learner.lastLearnTimeSum += parseInt($scope.learner.lastLearnTime);
          // 학습이력 저장
          apiSvc.call('doSaveLearnerHistory', $scope.learner).then(function(res) {
            // 학습 시작시 이력 저장 후 이력 순번키 저장
            if ($scope.learner.actionType == 'init') {
              if (res != null && res.hisSeqno != null) {
                $scope.learner.hisSeqno = res.hisSeqno;
              };
            };
            if (res != null && res.pobtYn != null) {
              $scope.learner.pobtYn = res.pobtYn;
            };
            console.log('학습이력 저장 호출 : Call Server doSaveLearnerHistory');
          });
        };

        $scope.stopTimer = function(actionType) {
          $scope.learner.actionType = actionType;
          $scope.learner.lastLearnTime = ($scope.item.saveTerm - $scope.viewer.counter);
          $scope.learner.totalLearningTime += parseInt($scope.learner.lastLearnTime);
          //$scope.learner.lastLearnTimeSum += parseInt($scope.learner.lastLearnTime);

          $scope.$broadcast('timer-stopped', $scope.viewer.counter);
          $scope.viewer.counter = $scope.item.saveTerm;
          $timeout.cancel(mytimeout);
          console.log('timer stopped saveTerm: ' + $scope.item.saveTerm);

          apiSvc.call('doSaveLearnerHistory', $scope.learner).then(function(res) {
            console.log('학습이력 저장 호출 : Call Server doSaveLearnerHistory');
            console.log('actionType : '+actionType);
            if (res != null && res.pobtYn != null) {
              $scope.learner.pobtYn = res.pobtYn;
            };
            if (actionType != undefined && actionType != null && actionType == 'exit') $ionicHistory.goBack(-1);
          });
        };

        $scope.$on('timer-stopped', function(event, remaining) {
          console.log('remaining : ' + remaining);
          if (remaining === 0) {
            console.log('your time ran out!');
          }
        });
      });
      
      // 아이템 콘텐츠 리소스 정보 세팅
      function setResource() {
        if ($scope.item.resourceList != undefined && $scope.item.resourceList != null) {
          angular.forEach($scope.item.resourceList, function(rsc, idx){
            if ($scope.item.mobileConnPk == rsc.rscSeqno) {
              // 미디어 파일
              if (rsc.rscTypeGb == '0001' || rsc.rscTypeGb == '0003') {
                if (rsc.rscDetailTypeGb != '000001' && $scope.item.rscTypeGb == null) {
                  $scope.item.rscTypeGb = rsc.rscTypeGb;
                  $scope.item.rscDetailTypeGb = rsc.rscDetailTypeGb;
                  $scope.item.rscDetailPath = rsc.rscDetailPath;
                  $scope.item.rscDetailFileName = rsc.rscDetailFileName;
                  $scope.item.cdnUrl = rsc.cdnUrl;
                  $scope.item.contentsServiceUrl = $scope.item.defaultContentsCdn + rsc.rscDetailPath + '/' + rsc.rscDetailFileName;
                }else if (rsc.rscDetailTypeGb == '000001' && rsc.rscStartFileYn == 'Y') {
                  if ($scope.item.vttYn == null || $scope.item.vttYn != 'Y') {
                    $scope.item.vttYn = 'Y';
                    $scope.item.rscDetailTypeGb = rsc.rscDetailTypeGb;
                    $scope.item.vttRscDetailPath = rsc.rscDetailPath;
                    $scope.item.vttRscDetailFileName = rsc.rscDetailFileName;
                    $scope.item.vttLangGb = rsc.langGb;
                    $scope.item.vttLangName = rsc.LangName;
                    $scope.item.vttServiceUrl = $scope.item.defaultContentsCdn + rsc.rscDetailPath + '/' + rsc.rscDetailFileName;
                  };
                };
              // 미디어 CDN
              }else if (rsc.rscTypeGb == '0002' || rsc.rscTypeGb == '0004') {
                // CDN 경로
                if (rsc.rscDetailTypeGb != '000001' && $scope.item.rscTypeGb == null) {
                  $scope.item.rscTypeGb = rsc.rscTypeGb;
                  $scope.item.rscDetailTypeGb = rsc.rscDetailTypeGb;
                  $scope.item.rscDetailFileName = rsc.rscDetailFileName;
                  $scope.item.cdnUrl = rsc.cdnUrl;

                  if (rsc.cdnUrl != null) {
                    if (rsc.rscDetailFileName.indexOf('://') > -1) {
                      $scope.item.contentsServiceUrl = rsc.rscDetailFileName;
                    }else {
                      if (rsc.cdnUrl.substring(rsc.cdnurl.length-1, 1) == '/') $scope.item.contentsServiceUrl = rsc.rscDetailFileName.startWith('/') ? rsc.cdnUrl.substring(0, rsc.cdnUrl.length-1) + rsc.rscDetailFileName : rsc.cdnUrl + rsc.rscDetailFileName;
                      else $scope.item.contentsServiceUrl = rsc.rscDetailFileName.startWith('/') ? rsc.cdnUrl + rsc.rscDetailFileName : rsc.cdnUrl.substring(0, rsc.cdnUrl.length-1) + rsc.rscDetailFileName;
                    };
                  }else {
                    $scope.item.contentsServiceUrl = rsc.rscDetailFileName;
                  };
                // 자막 파일
                }else if (rsc.rscDetailTypeGb == '000001' && rsc.rscStartFileYn == 'Y') {
                  if ($scope.item.vttYn == null || $scope.item.vttYn != 'Y') {
                    $scope.item.vttYn = 'Y';
                    $scope.item.rscDetailTypeGb = rsc.rscDetailTypeGb;
                    $scope.item.vttRscDetailPath = rsc.rscDetailPath;
                    $scope.item.vttRscDetailFileName = rsc.rscDetailFileName;
                    $scope.item.vttLangGb = rsc.langGb;
                    $scope.item.vttLangName = rsc.LangName;
                    $scope.item.vttServiceUrl = $scope.item.defaultContentsCdn + rsc.rscDetailPath + '/' + rsc.rscDetailFileName;
                  };
                };
              // 웹링크
              }else if (rsc.rscTypeGb == '0008') {
                if ($scope.item.rscTypeGb == null) {
                  $scope.item.rscTypeGb = rsc.rscTypeGb;
                  $scope.item.rscDetailTypeGb = rsc.rscDetailTypeGb;
                  $scope.item.rscDetailFileName = rsc.rscDetailFileName;
                  $scope.item.vttYn = 'N';
                  $scope.item.contentsServiceUrl = rsc.rscDetailFileName;
                };
              // 웹 콘텐츠
              }else if (rsc.rscTypeGb == '0009') {
                //콘텐츠 URL + Index
                if ($scope.item.rscTypeGb == null && $scope.item.rscStartFileYn == 'Y') {
                  $scope.item.rscTypeGb = rsc.rscTypeGb;
                  $scope.item.rscDetailTypeGb = rsc.rscDetailTypeGb;
                  $scope.item.vttRscDetailPath = rsc.rscDetailPath;
                  $scope.item.rscDetailFileName = rsc.rscDetailFileName;
                  $scope.item.vttYn = 'N';
                  $scope.item.contentsServiceUrl = $scope.item.defaultContentsCdn + rsc.rscDetailPath + '/' + rsc.rscDetailFileName;
                };
              };
            };
          });
        };
      };


      // 콘텐츠 정보 세팅
      function setContents() {

        console.log($scope.item.contentsServiceUrl);
        console.log('contents width:'+$scope.item.viewerWidthSize);
        console.log('contents height:'+$scope.item.viewerHgtSize);
        console.log('$scope.item.isMedia:'+$scope.item.isMedia);

        /* 1. 학습창 내 또는 새창 연결 여부 확인 */
        if ($scope.item.viewerRunYn != 'Y') {

          jQuery('#playerHeader').show();
          var ref = $window.open($scope.item.contentsServiceUrl, '_blank', 'location=no');//새창
          // Device 가 아닐경우 실행 안됨.
          if (ref != undefined) {
            // 브라우져 콘텐츠 로딩을 시작함
            ref.addEventListener("loadstart", function(event) {
              console.log('browser loadstart');
              control.start('init');
            }, false);

            // 브라우져 콘텐츠 로딩이 끝났음
            ref.addEventListener("loadstop", function(event) {
              console.log('browser loadstop');
              //control.stop();
            }, false);

            // 브라우져 콘텐츠 로딩중 에러
            ref.addEventListener("loaderror", function(event) {
              console.log('browser loaderror');
              control.stop();
              showAlert('콘텐츠를 로딩할 수 없습니다. 존재하지 않는 URL 이거나, 네트워크 문제일 수 있습니다.');
            }, false);

            // 브라우져 콘텐츠 종료
            ref.addEventListener("exit", function(event) {
              //showAlert('');
              console.log('browser exit');
              //$scope.doExit();
              control.exit();
              //$ionicHistory.goBack(-2);
            }, false);
          };

        }else {

          try {
            $sce.getTrustedResourceUrl($scope.item.contentsServiceUrl); // 콘텐츠 경로 검사
          }catch (err) {
            console.log(err);
            $ionicLoading.hide();
            showAlert('검증되지 않은 경로의 콘텐츠를 로딩할 수 없습니다.', true);
            
          };

          /*
          - connGb 유형
          '0001', // 동영상 파일
          '0002', // 동영상 CDN
          '0003', // 음성 파일
          '0004', // 오디오 CDN
          '0008', // 웹 링크 유형
          '0009', // 웹 콘텐츠 유형
          '1009'  // 평가 유형
           */
          
          if ($scope.item.connGb != undefined && $scope.item.connGb != null && env.ENABLE_CONN_GB.indexOf($scope.item.connGb) > -1) {
            console.log('$scope.item.connGb : '+$scope.item.connGb);
            /* 1. 학습창 기본 설정 */
            jQuery('#playerHeader').hide(); // 헤더 바 미디어 임베드로 변경
                      
            /* 2. 미디어 유형 공통 HTML5 Video Tag 설정 (connGb : 0001, 0002, 0003, 0004) */
            if ($scope.item.connGb == '0001' 
                || $scope.item.connGb == '0002' 
                || $scope.item.connGb == '0003' 
                || $scope.item.connGb == '0004') {

              learningObj = document.getElementById('media');

              learningObj.src = $scope.item.contentsServiceUrl;
              
// if (learningObj.requestFullscreen) {
//   console.log('learningObj.requestFullscreen');
//   learningObj.requestFullscreen();
// }else if (learningObj.mozRequestFullScreen) {
//   console.log('learningObj.requestFullscreen');
//   learningObj.mozRequestFullScreen();
// }else if (learningObj.webkitRequestFullscreen) {
//   console.log('learningObj.requestFullscreen');
//   learningObj.webkitRequestFullscreen();
// }else if (learningObj.msRequestFullscreen) {
//   console.log('learningObj.msRequestFullscreen');
//   learningObj.msRequestFullscreen();
// };

              learningObj.width = $window.innerWidth;

              console.log('=====================================');
              console.log(learningObj.width);
              console.log(learningObj.height);
              console.log(learningObj.clientWidth);
              console.log(learningObj.clientHeight);
              console.log(learningObj.videoWidth);
              console.log(learningObj.videoHeight);
              console.log('=====================================');


              //learningObj.src = 'http://wodcontents.iscu.ac.kr/contents/FMAM0001/01/01.mp4';

              $scope.item.isMedia = true;
              //$scope.mediaUrl = $scope.item.contentsServiceUrl;
              //$scope.item.poster = $stateParams.poster != null ? $stateParams.poster : env.VIDWER_DEFAULT_POSTER;

              //onResizeWindow();

              //console.log('media type : '+$scope.mediaUrl);

              console.log(learningObj);

              learningObj.addEventListener("loadedmetadata", function () {
                console.log('$rootScope.settings.isLastPosPlay : '+$rootScope.settings.isLastPosPlay);
                console.log('$scope.item.finalLearnPst : '+$scope.item.finalLearnPst);

                if ($rootScope.settings.autoPlay != undefined 
                  && $rootScope.settings.autoPlay == 'autoplay') {

                  control.start('init');
                };
                    //$scope.doStartStudy();

                $ionicLoading.hide();
                console.log('listener loadedmetadata');
              }, false);

              var isSetPos = false;
              //  paused and playing events to control buttons
              learningObj.addEventListener("canplay", function () {
                console.log('listener canplay');
                if ($rootScope.settings.isLastPosPlay && !isSetPos) {
                  var obj = document.getElementById('media');
                  console.log(obj.currentTime);
                  obj.currentTime = $scope.item.finalLearnPst;
                  isSetPos = true;
                  console.log('set time : '+obj.currentTime);
                };
              }, false);

              //  paused and playing events to control buttons
              learningObj.addEventListener("pause", function () {
                console.log('listener pause');
                //$scope.doPauseStudy();
                control.pause();
              }, false);

              learningObj.addEventListener("playing", function () {
                console.log('listener playing');
                //$scope.doStartStudy();
                control.start();
              }, false);

              learningObj.addEventListener("ended", function () {
                // document.getElementById("ndd").textContent = "Playback ended";
                console.log('listener ended');
                //$scope.doStopStudy();
                control.stop();
              }, false);

              learningObj.addEventListener("error", function (err) {
                console.log('error');
                console.log(err);
                //$scope.doStopStudy();
                control.stop();
              }, true);
            };
            
            /* 3. 그외 유형 iFrame 설정 (connGb : 0008, 0009, 1009) */
            if ($scope.item.connGb == '0009' || $scope.item.connGb == '1009') {
              console.log('그외 : '+$scope.item.connGb);
              learningObj = document.getElementById('webContents');
              
              jQuery('#playerHeader').show();

              $scope.item.isMedia = false;

              learningObj.onload = function() {
                //autoResize('webContents');
                $ionicLoading.hide();
                //$scope.doStartStudy();
                control.start('init');
              };
            };

            /* 4. 각 유형별 설정 */
            // 동영상 CDN
            if ($scope.item.connGb == '0002') {
              $scope.mediaType = 'video/mp4';
            // 음성 CDN
            }else if ($scope.item.connGb == '0004') {
              $scope.mediaType = 'audio/mp3';
            // 동영상 파일
            }else if ($scope.item.connGb == '0001') {
              $scope.mediaType = 'video/mp4';
            // 음성 파일
            }else if ($scope.item.connGb == '0003') {
              $scope.mediaType = 'audio/mp3';
            // 웹 링크
            }else if ($scope.item.connGb == '0008') {
              /*
              window.open(‘http://example.com’, ‘_system’); Loads in the system browser
              window.open(‘http://example.com’, ‘_blank’);  Loads in the InAppBrowser
              window.open(‘http://example.com’, ‘_blank’, ‘location=no’); Loads in the InAppBrowser with no location bar
              window.open(‘http://example.com’, ‘_self’); Loads in the Cordova web view
               */

              $scope.item.isMedia = false;

              console.log('$scope.item.viewerRunYn : ' + $scope.item.viewerRunYn);

              // if ($scope.item.viewerRunYn == 'Y') {
              //   ref = document.getElementById('webContents');
              //   jQuery('#playerHeader').show();
              //   ref.src = $scope.item.contentsServiceUrl;
              //   ref.onload = function(event) {
              //     console.log('웹링크 학습창 Onload: ');
              //     //autoResize('webContents');
              //     $ionicLoading.hide();
              //     //$scope.doStartStudy();
              //     control.start();
              //     console.log(event);
              //   };
              // }else {
              //   ref = $window.open($scope.item.contentsServiceUrl, '_blank', 'location=no');//새창
              // };
              
              var ref = $window.open($scope.item.contentsServiceUrl, '_blank', 'location=no');//새창
              // Device 가 아닐경우 실행 안됨.
              if (ref != undefined) {
                ref.addEventListener("loadstart", function(event) {
                  console.log('browser loadstart');
                  control.start('init');
                }, false);

                ref.addEventListener("loadstop", function(event) {
                  console.log('browser loadstop');
                  control.stop();
                }, false);

                ref.addEventListener("loaderror", function(event) {
                  console.log('browser loaderror');
                  control.stop();
                  showAlert('콘텐츠를 로딩할 수 없습니다. 존재하지 않는 URL 이거나, 네트워크 문제일 수 있습니다.');
                }, false);

                ref.addEventListener("exit", function(event) {
                  //showAlert('');
                  console.log('browser exit');
                  //$scope.doExit();
                  control.exit('exit');
                  //$ionicHistory.goBack(-2);
                }, false);
              };
              $ionicLoading.hide();
            // 웹 콘텐츠
            }else if ($scope.item.connGb == '0009') {
              learningObj.src = $scope.item.contentsServiceUrl;
              //$scope.webContentsUrl = $scope.item.contentsServiceUrl;
            // 평가
            }else if ($scope.item.connGb == '1009') {
              learningObj.src = $scope.item.contentsServiceUrl;
              //$scope.webContentsUrl = $scope.item.contentsServiceUrl;            
            };
          };
        };
      };

      function showAlert(msg, isGoBack) {
        var alertPopup = $ionicPopup.alert({
          title: '알림',
          template: msg,
          okText : '확인',
          okType : 'button-balanced'
        });
        
        alertPopup.then(function(res) {
          if (isGoBack) $ionicHistory.goBack(-1);
        });
      };
      
      // 미디어 사이즈 변경
      function resizeVideo() {

          console.log('미디어 사이즈 조절 전 ========================');
          // 미디어 창 크기
          console.log('미디어 창 크기 : video.clientWidth : '+learningObj.clientWidth);
          console.log('디바이스 크기 : $window.innerWidth : '+$window.innerWidth);

          console.log('미디어 창 크기 : video.clientHeight : '+learningObj.clientHeight);
          console.log('디바이스 크기 : $window.innerHeight : '+$window.innerHeight);
          
          // 디바이스 크기
          // 미디어 해상도
          console.log('미디어 해상도 : video.videoWidth : '+learningObj.videoWidth);
          console.log('미디어 해상도 : video.videoHeight : '+learningObj.videoHeight);


var video = jQuery('#media');
var widthX = 1;
var heightY = 1;
if (learningObj.clientWidth > 0 && learningObj.clientHeight > 0) {
  widthX = learningObj.clientWidth/learningObj.clientHeight;
  heightY = learningObj.clientHeight/learningObj.clientWidth;
}else if (learningObj.videoWidth > 0 && learningObj.videoHeight > 0) {
  widthX = learningObj.videoWidth/learningObj.videoHeight;
  heightY = learningObj.videoHeight/learningObj.videoWidth; 
};
// var widthX = learningObj.clientWidth/learningObj.clientHeight;
// var heightY = learningObj.clientHeight/learningObj.clientWidth;

if ($scope.viewerOrientation == 'portrait') {
  var width = $window.innerWidth;
  var height = width * heightY;

  if ($window.innerWidth > $window.innerHeight) {
    if (learningObj.clientHeight > 0) width = learningObj.clientHeight;
    else width = $window.innerHeight;
    height = width * heightY;
  };
  //video.height(height);
  video.width(width);

}else if ($scope.viewerOrientation == 'landscape') {
  var height = $window.innerHeight;
  var width = height*widthX;

  if ($window.innerHeight > $window.innerWidth) {
    if (learningObj.clientHeight > 0) height = learningObj.clientWidth;
    else height = $window.innerWidth;
    width = height * widthX;
  };
  console.log($scope.isIOS);
  if ($scope.isIOS) {
    height -= 20;
    video.height(height);
  }
  video.width(width);
};

          // var percentWidth = learningObj.clientWidth * 100 / learningObj.videoWidth;
          // var videoHeight = learningObj.videoHeight * percentWidth / 100;
          
          // if (videoHeight == 0 || videoHeight > $window.innerHeight) videoHeight = $window.innerHeight;
          // console.log('$window.innerHeight : '+$window.innerHeight);
          // console.log('videoHeight : '+videoHeight);

          // var video = jQuery('#media');
          // video.height(videoHeight);


          console.log('미디어 사이즈 조절 후 ========================');
          // 미디어 창 크기
          console.log('미디어 창 크기 : video.clientWidth : '+learningObj.clientWidth);
          console.log('디바이스 크기 : $window.innerWidth : '+$window.innerWidth);
          // 디바이스 크기
          console.log('미디어 창 크기 : video.clientHeight : '+learningObj.clientHeight);
          console.log('디바이스 크기 : $window.innerHeight : '+$window.innerHeight);
          // 미디어 해상도
          console.log('미디어 해상도 : video.videoWidth : '+learningObj.videoWidth);
          console.log('미디어 해상도 : video.videoHeight : '+learningObj.videoHeight);

      };

      // 학습 뷰어 콘트롤러
      var control = {
        /* 학습 시작 */
        start : function (actionType) {
          if (!$scope.item.isPlaying) {
            if (!$scope.learner.isLearningStarted) {
              $scope.learner.startTimestamp = Math.floor(Date.now() / 1000);
              $scope.learner.startTime = new Date($scope.learner.startTimestamp*1000);
              $scope.learner.isLearningStarted = true;
            };
            console.log("시작");

            $scope.item.isPlaying = true;
            $scope.learner.lastStartTimestamp = Math.floor(Date.now() / 1000);
            $scope.learner.lastStartTime= new Date($scope.learner.lastStartTimestamp*1000);
            // $scope.learner.lastLearnTime = 0;

            // $scope.learner.lastLearnTimeSum += $scope.learner.lastLearnTime;




            if ($scope.item.isMedia) {
// if (learningObj.requestFullscreen) {
//   console.log('learningObj.requestFullscreen');
//   learningObj.requestFullscreen();
// }else if (learningObj.mozRequestFullScreen) {
//   console.log('learningObj.requestFullscreen');
//   learningObj.mozRequestFullScreen();
// }else if (learningObj.webkitRequestFullscreen) {
//   console.log('learningObj.requestFullscreen');
//   learningObj.webkitRequestFullscreen();
// }else if (learningObj.msRequestFullscreen) {
//   console.log('learningObj.msRequestFullscreen');
//   learningObj.msRequestFullscreen();
// };
              if (learningObj) learningObj.play();
              // $scope.learner.finalLearnPst = parseInt(learningObj.currentTime);
            }else {

            };


            // 처음 실행이면 init 호출
            if ($scope.learner.actionType == 'unset') {
              $scope.startTimer('init');
            }else {
              if (actionType) $scope.startTimer(actionType);
              else $scope.startTimer('start');
            };
            console.log('$scope.learner.totalLearningTime:'+$scope.learner.totalLearningTime);
            console.log('$scope.learner.lastStartTimestamp:'+$scope.learner.lastStartTimestamp);
            console.log('$scope.learner.lastPausedTimestamp:'+$scope.learner.lastPausedTimestamp);
          };
        },
        /* 학습 재개 */
        resume : function () {
          if (!$scope.item.isPlaying) {
            console.log("다시 시작");

            $scope.item.isPlaying = true;
            $scope.learner.lastStartTimestamp = Math.floor(Date.now() / 1000);
            $scope.learner.lastStartTime= new Date($scope.learner.lastStartTimestamp*1000);
            // $scope.learner.lastLearnTime = 0;

            // $scope.learner.lastLearnTimeSum += $scope.learner.lastLearnTime;

            if ($scope.item.isMedia) {
              if (learningObj) learningObj.play();
              //$scope.learner.finalLearnPst = parseInt(learningObj.currentTime);
            }else {

            };

            $scope.startTimer('resume');
            console.log('$scope.learner.totalLearningTime:'+$scope.learner.totalLearningTime);
            console.log('$scope.learner.lastStartTimestamp:'+$scope.learner.lastStartTimestamp);
            console.log('$scope.learner.lastPausedTimestamp:'+$scope.learner.lastPausedTimestamp);
          };
        },
        /* 학습 일시 중지 */
        pause : function () {
          if ($scope.item.isPlaying) {
            console.log("일시 중지");
            $scope.item.isPlaying = false;
            $scope.learner.lastPausedTimestamp = Math.floor(Date.now() / 1000);
            $scope.learner.lastPausedTime= new Date($scope.learner.lastPausedTimestamp*1000);
            $scope.learner.lastLearningTime += ($scope.learner.lastPausedTimestamp - $scope.learner.lastStartTimestamp);
            // $scope.learner.lastLearnTime = ($scope.item.saveTerm - $scope.viewer.counter);

            // $scope.learner.lastLearnTimeSum += $scope.learner.lastLearnTime;

            if ($scope.item.isMedia) {
              if (learningObj) learningObj.pause();
              $scope.learner.finalLearnPst = parseInt(learningObj.currentTime);
            }else {
            };

            $scope.stopTimer('pause');
            console.log('$scope.learner.totalLearningTime:'+$scope.learner.totalLearningTime);
            console.log('$scope.learner.lastStartTimestamp:'+$scope.learner.lastStartTimestamp);
            console.log('$scope.learner.lastPausedTimestamp:'+$scope.learner.lastPausedTimestamp);
          };
        },
        /* 학습 종료 */
        stop : function () {
          if ($scope.item.isPlaying) {
            console.log("종료");

            $scope.item.isPlaying = false;
            $scope.learner.lastPausedTimestamp = Math.floor(Date.now() / 1000);
            $scope.learner.lastPausedTime= new Date($scope.learner.lastPausedTimestamp*1000);
            $scope.learner.lastLearningTime += ($scope.learner.lastPausedTimestamp - $scope.learner.lastStartTimestamp);
            // $scope.learner.lastLearnTime = ($scope.item.saveTerm - $scope.viewer.counter);

            // $scope.learner.lastLearnTimeSum += $scope.learner.lastLearnTime;

            if ($scope.item.isMedia) {
              if (learningObj) learningObj.pause();
              $scope.learner.finalLearnPst = parseInt(learningObj.currentTime);
            }else {

            };

            $scope.stopTimer('stop');

            console.log('$scope.learner.totalLearningTime:'+$scope.learner.totalLearningTime);
            console.log('$scope.learner.lastStartTimestamp:'+$scope.learner.lastStartTimestamp);
            console.log('$scope.learner.lastPausedTimestamp:'+$scope.learner.lastPausedTimestamp);
          };          
        }, 
        /* 뷰어 종료 */
        exit : function () {
          $scope.learner.isLearningEnded = true;
          $scope.learner.endTimestamp = Math.floor(Date.now() / 1000);
          $scope.learner.endTime = new Date($scope.learner.endTimestamp*1000);
          //$scope.doStopStudy();
          
          control.stop();
          $scope.stopTimer('exit');
var msg = '시작시간 : ' + new Date($scope.learner.startTimestamp*1000);
msg += '종료시간 : ' + new Date($scope.learner.endTimestamp*1000);
msg += '학습시간 : ' + $scope.learner.totalLearningTime;
msg += '재생위치 : ' + $scope.learner.finalLearnPst;
console.log('exit ---------------');
console.log(msg);
showAlert(msg);



          console.log('$scope.learner.startTimestamp:'+$scope.learner.startTimestamp);
          console.log('$scope.learner.endTimestamp:'+$scope.learner.endTimestamp);
          console.log('$scope.learner.totalLearningTime:'+$scope.learner.totalLearningTime);
          console.log('$scope.learner.lastStartTimestamp:'+$scope.learner.lastStartTimestamp);
          console.log('$scope.learner.lastPausedTimestamp:'+$scope.learner.lastPausedTimestamp);
        }
      };
    }
  ]);
});