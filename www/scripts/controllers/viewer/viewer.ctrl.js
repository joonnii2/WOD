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
      
      $rootScope.settings = JSON.parse($window.localStorage.getItem(env.LOCAL_SETTING_KEY) || "{}");
      $scope.startTimestamp = null;       // 학습 시작 시간
      $scope.endTimestamp = null;         // 학습 종료 시간
      $scope.totalTime = 0;               // 총 학습 시간
      $scope.lastPlayTimestamp = null;    // 최근 다시 시작한 시간
      $scope.lastPausedTimestamp = null;  // 최근 일시 중지한 시간
      $scope.isPlaying = false;
      $scope.isMedia = false;
      $scope.isLearningStarted = false;
      $scope.isLearningEnded = false;

      // Setup the loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      // 학습 일시 중지
      $scope.doPauseStudy = function() {
        if ($scope.isPlaying) {
          console.log("일시 중지");
// alert('currentTime : ' + document.getElementById("media").currentTime);
          $scope.isPlaying = false;
          $scope.lastPausedTimestamp = Math.floor(Date.now() / 1000);
          $scope.totalTime += ($scope.lastPausedTimestamp - $scope.lastPlayTimestamp);

          if ($scope.isMedia) {
            if (learningObj) learningObj.pause();
          }else {
          };

          console.log('$scope.totalTime:'+$scope.totalTime);
          console.log('$scope.lastPlayTimestamp:'+$scope.lastPlayTimestamp);
          console.log('$scope.lastPausedTimestamp:'+$scope.lastPausedTimestamp);
        };
      };

      // 학습 재개
      $scope.doResumeStudy = function() {
        if (!$scope.isPlaying) {
          console.log("다시 시작");

          $scope.isPlaying = true;
          $scope.lastPlayTimestamp = Math.floor(Date.now() / 1000);

          if ($scope.isMedia) {
            if (learningObj) learningObj.play();
          }else {

          };

          console.log('$scope.totalTime:'+$scope.totalTime);
          console.log('$scope.lastPlayTimestamp:'+$scope.lastPlayTimestamp);
          console.log('$scope.lastPausedTimestamp:'+$scope.lastPausedTimestamp);
        };
      };

      // 학습 종료
      $scope.doStopStudy = function() {
        if ($scope.isPlaying) {
          console.log("종료");

          $scope.isPlaying = false;
          $scope.lastPausedTimestamp = Math.floor(Date.now() / 1000);
          $scope.totalTime += ($scope.lastPausedTimestamp - $scope.lastPlayTimestamp);

          if ($scope.isMedia) {
            if (learningObj) learningObj.pause();
          }else {

          };

          console.log('$scope.totalTime:'+$scope.totalTime);
          console.log('$scope.lastPlayTimestamp:'+$scope.lastPlayTimestamp);
          console.log('$scope.lastPausedTimestamp:'+$scope.lastPausedTimestamp);
        };
      };

      // 학습 뷰어 종료
      $scope.doExit = function() {
        $scope.isLearningEnded = true;
        $scope.doStopStudy();
        $scope.endTimestamp = Math.floor(Date.now() / 1000);

        console.log('$scope.startTimestamp:'+$scope.startTimestamp);
        console.log('$scope.endTimestamp:'+$scope.endTimestamp);
        console.log('$scope.totalTime:'+$scope.totalTime);
        console.log('$scope.lastPlayTimestamp:'+$scope.lastPlayTimestamp);
        console.log('$scope.lastPausedTimestamp:'+$scope.lastPausedTimestamp);
      };

      // 학습 시작
      $scope.doStartStudy = function() {
        // document.getElementById("media").currentTime = 10;
        // alert('currentTime : ' + document.getElementById("media").currentTime);
        if (!$scope.isPlaying) {
          if (!$scope.isLearningStarted) {
            $scope.startTimestamp = Math.floor(Date.now() / 1000);
            $scope.isLearningStarted = true;
          }
          console.log("시작");

          $scope.isPlaying = true;
          $scope.lastPlayTimestamp = Math.floor(Date.now() / 1000);

          if ($scope.isMedia) {
            if (learningObj) learningObj.play();
          }else {

          };

          console.log('$scope.totalTime:'+$scope.totalTime);
          console.log('$scope.lastPlayTimestamp:'+$scope.lastPlayTimestamp);
          console.log('$scope.lastPausedTimestamp:'+$scope.lastPausedTimestamp);
        };
      };

      // 화면 터치
      $scope.onTouch = function() {
        if ($scope.isMedia) {
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
        $scope.doPauseStudy();

        var confirmPopup = $ionicPopup.confirm({
          title: '학습종료',
          template: '학습을 종료하시겠습니까?'
        });
        
        confirmPopup.then(function(res) { 
          if(res) {
            $scope.doExit();
            $ionicHistory.goBack(-2);
          } else {
            $scope.doResumeStudy();
          }
        });
      };

      $ionicPlatform.ready(function() {

        setContents();

        $window.addEventListener("orientationchange", function() {
          doOnOrientationChange();
        }, false);

        $window.addEventListener("resume", function() {
          $scope.doResumeStudy();
        }, false);
        
        $window.addEventListener("pause", function() {
          $scope.doPauseStudy();
        }, false);

      });

      var learningObj = document.getElementById('media');

      // 앱 가로/세로 변경
      function doOnOrientationChange() {

        switch($window.orientation) {  
          case -90: // 가로모드 landscape

            $scope.viewerOrientation = 'landscape';

            if ($scope.isMedia) {
              onResizeWindow();
            }else {
              $scope.webContentsWidth = $window.innerWidth;
            }
            break;
          case 90: // 가로모드 landscape
            $scope.viewerOrientation = 'landscape';
            if ($scope.isMedia) {
              onResizeWindow();
            }else {
              $scope.webContentsWidth = $window.innerWidth;
            }
            break; 
          case 0: // 세로모드 Portrait
            $scope.viewerOrientation = 'portrait';
            if ($scope.isMedia) {
              onResizeWindow();
            }else {
              $scope.webContentsWidth = $window.innerWidth;
            }
            break; 
          case 180: // 세로모드 Portrait
            $scope.viewerOrientation = 'portrait';
            if ($scope.isMedia) {
              onResizeWindow();
            }else {
              $scope.webContentsWidth = $window.innerWidth;
            }
            break; 
          default: // 세로모드 Portrait
            $scope.viewerOrientation = 'portrait';
            if ($scope.isMedia) {
              onResizeWindow();
            }else {
              $scope.webContentsWidth = $window.innerWidth;
            }
            break; 
        };
        console.log('viewerOrientation : ' + $scope.viewerOrientation );
        console.log('window Width : '+$window.innerWidth);
        console.log('window Height : '+$window.innerHeight);
        console.log('video Width : '+$scope.mediaWidth);
        console.log('video Height : '+$scope.mediaHeight);
      };

      function setContents() {

        try {
          $scope.contentsUrl = $sce.getTrustedResourceUrl($stateParams.contentsUrl); // 콘텐츠 경로 검사
        }catch (err) {
          console.log(err);
          alert('콘텐츠를 로딩할 수 없습니다.');

          $ionicLoading.hide();
          $ionicHistory.goBack(-1);
        };

        if ($stateParams.contentsType != undefined) {

          console.log('-----window width : '+$window.innerWidth);
          console.log('media width : '+$stateParams.width);
          console.log('window height : '+$window.innerHeight);
          console.log('media height : '+$stateParams.height);

          jQuery('#playerHeader').hide();

          // 미디어 유형일 경우
          if ($stateParams.contentsType == 'VIDEO' || $stateParams.contentsType == 'AUDIO') {

            learningObj = document.getElementById('media');

            $scope.isMedia = true;
            $scope.mediaUrl = $scope.contentsUrl;
            $scope.poster = $stateParams.poster != null ? $stateParams.poster : env.VIDWER_DEFAULT_POSTER;
            
            if ($stateParams.contentsType == 'VIDEO') {
              $scope.mediaType = 'video/mp4';
            }else if ($stateParams.contentsType == 'AUDIO') {
              $scope.mediaType = 'audio/mp3';
            };

            onResizeWindow();
            
            learningObj.addEventListener("loadedmetadata", function () {
              if ($rootScope.settings.autoPlay != undefined 
                && $rootScope.settings.autoPlay == 'autoplay') 
                  $scope.doStartStudy();

              $ionicLoading.hide();
              console.log('loadedmetadata');
            }, false);

            //  paused and playing events to control buttons
            learningObj.addEventListener("pause", function () {
              console.log('pause');
              $scope.doPauseStudy();
            }, false);

            learningObj.addEventListener("playing", function () {
              console.log('playing');
              $scope.doStartStudy();
            }, false);

            learningObj.addEventListener("ended", function () {
              // document.getElementById("ndd").textContent = "Playback ended";
              console.log('ended');
              $scope.doStopStudy();
            }, false);

            learningObj.addEventListener("error", function (err) {
              console.log('error');
              console.log(err);
              $scope.doStopStudy();
            }, true);

          // 웹 콘텐츠 유형일 경우
          }else {
            
            learningObj = document.getElementById('webContents');
            jQuery('#playerHeader').show();

            $scope.isMedia = false;

            if ($stateParams.contentsType == 'WEB') {
              $scope.webContentsUrl = $scope.contentsUrl;
              $scope.webContentsWidth = $stateParams.width != null ? $stateParams.width : env.VIEWER_WIDTH;
              $scope.webContentsWidth = $window.innerWidth;

              learningObj.onload = function() {
                //autoResize('webContents');
                $ionicLoading.hide();
                $scope.doStartStudy();
              };
            }else if ($stateParams.contentsType == 'URL') {

              $ionicLoading.hide();
              $scope.doStartStudy();
              //showAlert('새창에서 실행되었습니다.');
              
              //openBrowser($scope.contentsUrl);
              //$scope.openInExternalBrowser($scope.contentsUrl);
              //$scope.openInAppBrowser($scope.contentsUrl);
              //$scope.openCordovaWebView($scope.contentsUrl);
              //
              // learningObj = $window.open($scope.contentsUrl, '_self', 'location=yes');
              // return false;
              // $scope.doStartStudy();
              
              var ref = $window.open($scope.contentsUrl, '_blank', 'location=no');

              ref.addEventListener("loadstart", function() {
                console.log('browser loadstart');
              }, false);

              ref.addEventListener("loadstop", function() {
                console.log('browser loadstop');
                $ionicLoading.hide();
              }, false);

              ref.addEventListener("loaderror", function() {
                console.log('browser loaderror');
                $ionicLoading.hide();
                showAlert('콘텐츠를 로딩할 수 없습니다. 존재하지 않는 URL 이거나, 네트워크 문제일 수 있습니다.');
              }, false);

              ref.addEventListener("exit", function() {
                //showAlert('');
                console.log('browser exit');
                $scope.doExit();
                $ionicHistory.goBack(-2);
              }, false);
            }else {

            }
          };
        };
      };

      // function openBrowser(url) {
      //   var options = {
      //     location: 'no',
      //     clearcache: 'yes',
      //     toolbar: 'no'
      //   };

      //   $cordovaInAppBrowser.open(url, '_self', options)
      //   .then(function(event) {
      //     // success
      //     console.log('contents load success');
      //   })
      //   .catch(function(event) {
      //     // error
      //     console.log(event);
      //   });

        
      // };

// $scope.openInExternalBrowser = function(url)
// {
//  // Open in external browser
//  window.open(url,'_system','location=yes'); 
// };
 
// $scope.openInAppBrowser = function(url)
// {
//  // Open in app browser
//  window.open(url,'_blank','location=no'); 
// };
 
// $scope.openCordovaWebView = function(url)
// {
//  // Open cordova webview if the url is in the whitelist otherwise opens in app browser
//  window.open(url,'_self','location=no'); 
// };


      function showAlert(msg) {
        var alertPopup = $ionicPopup.alert({
          title: '알림',
          template: msg
        });
        
        alertPopup.then(function(res) {
          // $scope.doExit();
          // $ionicHistory.goBack(-2);
           // console.log('Thank you for advice.');
        });
      };

      // 화면 사이즈 변경
      function onResizeWindow() {
        if ($scope.isMedia) {
          console.log('isMedia : '+$scope.isMedia);
          var video = jQuery("#media");
          if (learningObj) resizeVideo(video);
        }else {
          if (learningObj) resizeFrame();
        };
      };

      // 프레임 사이즈 변경
      function resizeFrame() {

      };

      // 미디어 사이즈 변경
      function resizeVideo(videoObject) {
        console.log('resizeVideo : ');
          var percentWidth = videoObject.clientWidth * 100 / videoObject.videoWidth;
          console.log('percentWidth : '+percentWidth);
          console.log('videoObject.videoHeight : '+videoObject.videoHeight);
          var videoHeight = videoObject.videoHeight * percentWidth / 100;
          
          if (videoHeight == 0 || videoHeight > $window.innerHeight) videoHeight = $window.innerHeight;
          console.log('$window.innerHeight : '+$window.innerHeight);
          console.log('videoHeight : '+videoHeight);

          videoObject.height(videoHeight);
      };




      //autoResize('webContents');
// function autoResize(id){
//     var newheight;
//     var newwidth;

//     if(document.getElementById){
//         newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
//         newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
//         console.log('newheight:'+document.getElementById(id).contentWindow.document.body.scrollHeight);
//         console.log('newwidth:'+document.getElementById(id).contentWindow.document.body.scrollWidth);
//         document.getElementById(id).contentWindow.document.body.width = newwidth;
//         document.getElementById(id).contentWindow.document.body.height = newheight;
//     }

//     document.getElementById(id).height = (newheight) + "px";
//     document.getElementById(id).width = (newwidth) + "px";
// }
      // 학습창 종료시 주차 목록 화면으로 이동
      // $scope.exitViewer = function () {
      //   console.log('exitViewer');
      //   if (confirm('학습을 종료하시겠습니까?')) {
      //     console.log('confirmed');
      //     $scope.doExit();
      //     $ionicHistory.goBack(-2);
      //     // var i,
      //     //     currentHistoryId = $ionicHistory.currentHistoryId(),
      //     //     history = $ionicHistory.viewHistory();
      //     // if (history.histories[currentHistoryId] != undefined && history.histories[currentHistoryId] != null)
      //     // var stack = history.histories[currentHistoryId].stack;

      //     // if (stack != undefined && stack[stack.length-1] != undefined) {
      //     //   $ionicHistory.backView(stack[stack.length-1]);
      //     //   $ionicHistory.goBack(-1);
      //     // }else {
      //     //   if (!$ionicHistory.goBack(-1)) $state.go('myclass.tocList', $stateParams);
      //     // };
      //   };
      //   // for (i = 0; i < stack.length; i += 1) {
      //   //   console.log(stack[i].stateId);


      //   //     if (stack[i].stateId.indexOf("member.ingCourseDetail_") == 0) {
      //   //         $ionicHistory.backView(stack[i]);
      //   //         $ionicHistory.goBack(-1);
      //   //         break;
      //   //     }
      //   // }
      // };


    }
  ]);
});
          // Video Events
          // // content has loaded, display buttons and set up events
          // mediaObj.addEventListener("canplay", function () {
          //   console.log('canplay');
          // }, false);

          // //  display the current and remaining times
          // mediaObj.addEventListener("timeupdate", function () {
          //   //  Current time  
          //   // var vTime = video.currentTime;
          //   // document.getElementById("curTime").textContent = vTime.toFixed(1);
          //   // document.getElementById("vRemaining").textContent = (vLength - vTime).toFixed(1);
          //   console.log('timeupdate');
          // }, false);

          // mediaObj.addEventListener("volumechange", function () {
          //   if (video.muted) {
          //     // if muted, show mute image
          //     document.getElementById("mute").innerHTML = "<img alt='volume off button' src='mute2.png' />";
          //     console.log('');
          //   } else {
          //     // if not muted, show not muted image
          //     document.getElementById("mute").innerHTML = "<img alt='volume on button' src='vol2.png' />";
          //     console.log('');
          //   }
          //   console.log('volumechange');
          // }, false);
          // //  Download and playback status events.
          // mediaObj.addEventListener("loadstart", function () {
          //   // document.getElementById("ls").textContent = "Started";
          //   console.log('loadstart');
          // }, false);
          // mediaObj.addEventListener("loadeddata", function () {
          //   // document.getElementById("ld").textContent = "Data was loaded";
          //   console.log('loadeddata');
          // }, false);

          // mediaObj.addEventListener("emptied", function () {
          //   // document.getElementById("mt").textContent = "Video reset";
          //   console.log('emptied');
          // }, false);

          // mediaObj.addEventListener("stalled", function () {
          //   // document.getElementById("stall").textContent = "Download was stalled";
          //   console.log('stalled');
          // }, false);
          // mediaObj.addEventListener("waiting", function () {
          //   // document.getElementById("waiting").textContent = "Player waited for content";
          //   console.log('waiting');
          // }, false);

          // mediaObj.addEventListener("durationchange", function () {
          //   // document.getElementById("dc").textContent = "Duration has changed";
          //   console.log('durationchange');
          // }, false);
          // mediaObj.addEventListener("canplaythrough", function () {
          //   // document.getElementById("cpt").textContent = "Ready to play whole video";
          //   console.log('canplaythrough');
          // }, false);
          // mediaObj.addEventListener("progress", function () {
          //   // pgFlag += "+";
          //   // if (pgFlag.length > 10) {
          //   //   pgFlag = "+";
          //   // }
          //   // document.getElementById("pg").textContent = pgFlag;
          //   console.log('progress');
          // }, false);