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

      $ionicPlatform.ready(function() {

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
          startTimestamp : null,          // 학습 시작 시간
          endTimestamp : null,            // 학습 종료 시간
          totalLearningTime : 0,          // 총 학습 시간
          lastStartTimestamp : null,      // 최근 다시 시작한 시간
          lastPausedTimestamp : null,     // 최근 일시 중지한 시간
          isLearningStarted : false,      // 학습을 시작 했는지 여부
          isLearningEnded : false         // 학습이 종료 됬는지 여부
        };

        /* 학습 아이템 정보 */
        $scope.item = {
          lectureSeqno : $stateParams.lectureSeqno,     // 강좌 일련번호
          wsSeqno : $stateParams.wsSeqno,               // 주차 일련번호
          tocSeqno : $stateParams.tocSeqno,             // 학습목차 일련번호
          connGb : $stateParams.connGb,                 // 학습자원 종류 -------------
          mobileConnPk : $stateParams.mobileConnPk,     // 모바일 리소스 연계 키
          prgssRateCompleteBasis : $stateParams.prgssRateCompleteBasis, // 콘텐츠 완료 기준 진도율
          viewerRunYn : $stateParams.viewerRunYn,       // 학습창내 실행 여부(학습창/새창 여부)  ----------
          viewerWidthSize : $stateParams.viewerWidthSize ? $stateParams.viewerWidthSize : env.VIEWER_WIDTH,  // 학습창 넓이 -----------
          viewerHgtSize : $stateParams.viewerHgtSize ? $stateParams.viewerHgtSize : env.VIEWER_HEIGHT,// 학습창 높이 -----------
          tocName : $stateParams.tocName,                // 목차타이틀
          saveTerm : null,                               // 학습이력 저장 간격 (초)
          defaultContentsCdn : null,                     // 웹 콘텐츠 기본 경로
          itemDetail : null,                             // 주차의 학습 목차 목록
          resourceList : null,                           // 학습목차에 연결된 학습 자원 목록
          isMedia : false,                               // 미디어인지 여부
          isPlaying : false,                             // 학습중인지 여부
          tocEdTime : null,                              // 목차 권장 학습 시간
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
          poster : env.VIEWER_DEFAULT_POSTER             // 미디어 썸네일 이미지
        };
        
        //$scope.webContentsServiceUrl = null;
        //$scope.mediaServiceUrl = null;

        /* 학습 데이터 조회 및 설정 시작*/
        apiSvc.call('doLoadingServiceInfo', $stateParams).then(function(res) {
          if (res != null) {
            $scope.item.saveTerm = res.SAVE_TERM;
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
                };
              });
            };
            if ($scope.item.viewingYn != 'Y') showAlert('학습 가능 기간이 아닙니다.', true);

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

          var confirmPopup = $ionicPopup.confirm({
            title: '학습종료',
            template: '학습을 종료하시겠습니까?'
          });
          
          confirmPopup.then(function(res) { 
            if(res) {
              //$scope.doExit();
              control.exit();
              $ionicHistory.goBack(-2);
            } else {
              //$scope.doResumeStudy();
              control.resume();
            }
          });
        };

        $window.addEventListener("orientationchange", function() {
          switch($window.orientation) {  
            case -90: // 가로모드 landscape

              $scope.viewerOrientation = 'landscape';

              if ($scope.item.isMedia) {
                onResizeWindow();
              }else {
                $scope.webContentsWidth = $window.innerWidth;
              }
              break;
            case 90: // 가로모드 landscape
              $scope.viewerOrientation = 'landscape';
              if ($scope.item.isMedia) {
                onResizeWindow();
              }else {
                $scope.webContentsWidth = $window.innerWidth;
              }
              break; 
            case 0: // 세로모드 Portrait
              $scope.viewerOrientation = 'portrait';
              if ($scope.item.isMedia) {
                onResizeWindow();
              }else {
                $scope.webContentsWidth = $window.innerWidth;
              }
              break; 
            case 180: // 세로모드 Portrait
              $scope.viewerOrientation = 'portrait';
              if ($scope.item.isMedia) {
                onResizeWindow();
              }else {
                $scope.webContentsWidth = $window.innerWidth;
              }
              break; 
            default: // 세로모드 Portrait
              $scope.viewerOrientation = 'portrait';
              if ($scope.item.isMedia) {
                onResizeWindow();
              }else {
                $scope.webContentsWidth = $window.innerWidth;
              }
              break; 
          };
        }, false);

        $window.addEventListener("resume", function() {
          //$scope.doResumeStudy();
          control.resume();
        }, false);
        
        $window.addEventListener("pause", function() {
          //$scope.doPauseStudy();
          control.pause();
        }, false);
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
          /* 0. 학습창 기본 설정 */
          jQuery('#playerHeader').hide(); // 헤더 바 미디어 임베드로 변경

          /* 1. 학습창 내 또는 새창 연결 여부 확인 */
          if ($scope.item.viewerRunYn == 'Y') {

          }else {

          };
                    
          /* 2. 미디어 유형 공통 HTML5 Video Tag 설정 (connGb : 0001, 0002, 0003, 0004) */
          if ($scope.item.connGb == '0001' 
              || $scope.item.connGb == '0002' 
              || $scope.item.connGb == '0003' 
              || $scope.item.connGb == '0004') {

            learningObj = document.getElementById('media');
            learningObj.src = $scope.item.contentsServiceUrl;

            $scope.item.isMedia = true;
            //$scope.mediaUrl = $scope.item.contentsServiceUrl;
            //$scope.item.poster = $stateParams.poster != null ? $stateParams.poster : env.VIDWER_DEFAULT_POSTER;

            onResizeWindow();

            console.log('media type : '+$scope.mediaUrl);

            console.log(learningObj);

            learningObj.addEventListener("loadedmetadata", function () {
              if ($rootScope.settings.autoPlay != undefined 
                && $rootScope.settings.autoPlay == 'autoplay') 
                  //$scope.doStartStudy();
                  control.start();

              $ionicLoading.hide();
              console.log('listener loadedmetadata');
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
              control.start();
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

            var ref = null;
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
            
            ref = $window.open($scope.item.contentsServiceUrl, '_blank', 'location=no');//새창
            
            if (ref != undefined) {
              ref.addEventListener("loadstart", function(event) {
                console.log('browser loadstart');
                control.start();
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
                control.exit();
                $ionicHistory.goBack(-2);
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
      // 프레임 사이즈 변경
      function resizeFrame() {

      };

      // 미디어 사이즈 변경
      function resizeVideo(videoObject) {
          var percentWidth = videoObject.clientWidth * 100 / videoObject.videoWidth;
          var videoHeight = videoObject.videoHeight * percentWidth / 100;
          
          if (videoHeight == 0 || videoHeight > $window.innerHeight) videoHeight = $window.innerHeight;
          console.log('$window.innerHeight : '+$window.innerHeight);
          console.log('videoHeight : '+videoHeight);

          videoObject.height(videoHeight);
      };

      // 학습창 로딩시 필요 정보 조회
      function doLoadingServiceInfo(param) {
        apiSvc.call('doLoadingServiceInfo', param).then(function(res) {
          if (res != null) {
            $scope.item.saveTerm = res.SAVE_TERM;
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
                };
              });
            };
            if ($scope.item.viewingYn != 'Y') showAlert('학습 가능 기간이 아닙니다.', true);
            if (res.RESOURCE_LIST != undefined && res.RESOURCE_LIST != null) {
              angular.forEach(res.RESOURCE_LIST, function(rsc, idx){
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
        });
      };

      // 화면 사이즈 변경
      function onResizeWindow() {
          console.log('onResizeWindow isMedia : '+$scope.item.isMedia);
        if ($scope.item.isMedia) {
          console.log('isMedia : '+$scope.item.isMedia);
          var video = jQuery('#media');
          console.log('video.clientWidth : '+video.clientWidth);
          console.log('video.videoWidth : '+video.videoWidth);
          console.log('video.videoHeight : '+video.videoHeight);
          console.log('$window.innerHeight : '+$window.innerHeight);
          video.width($window.innerWidth);
          //resizeVideo(video);

        }else {
          resizeFrame();
        };
      };

      // 학습 뷰어 콘트롤러
      var control = {
        /* 학습 시작 */
        start : function () {
          if (!$scope.item.isPlaying) {
            if (!$scope.learner.isLearningStarted) {
              $scope.learner.startTimestamp = Math.floor(Date.now() / 1000);
              $scope.learner.isLearningStarted = true;
            }
            console.log("시작");

            $scope.item.isPlaying = true;
            $scope.learner.lastStartTimestamp = Math.floor(Date.now() / 1000);

            if ($scope.item.isMedia) {
              if (learningObj) learningObj.play();
            }else {

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

            if ($scope.item.isMedia) {
              if (learningObj) learningObj.play();
            }else {

            };

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
            $scope.learner.totalLearningTime += ($scope.learner.lastPausedTimestamp - $scope.learner.lastStartTimestamp);

            if ($scope.item.isMedia) {
              if (learningObj) learningObj.pause();
            }else {
            };

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
            $scope.learner.totalLearningTime += ($scope.learner.lastPausedTimestamp - $scope.learner.lastStartTimestamp);

            if ($scope.item.isMedia) {
              if (learningObj) learningObj.pause();
            }else {

            };

            console.log('$scope.learner.totalLearningTime:'+$scope.learner.totalLearningTime);
            console.log('$scope.learner.lastStartTimestamp:'+$scope.learner.lastStartTimestamp);
            console.log('$scope.learner.lastPausedTimestamp:'+$scope.learner.lastPausedTimestamp);
          };          
        }, 
        /* 뷰어 종료 */
        exit : function () {
          $scope.learner.isLearningEnded = true;
          $scope.learner.endTimestamp = Math.floor(Date.now() / 1000);
          //$scope.doStopStudy();
          control.stop();

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