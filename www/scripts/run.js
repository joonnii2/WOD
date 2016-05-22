define([
  'app'
  ,'services/common/api.svc'
  ,'services/common/session.svc'
], function (app, commonUtil) {
  'use strict';
  // the run blocks
  app.run([
    '$ionicPlatform', '$rootScope', '$state', 'SessionSvc', 'ENV', '$cordovaStatusbar', '$cordovaTouchID', 
    function ($ionicPlatform, $rootScope, $state, sessionSvc, env, $cordovaStatusbar, $cordovaTouchID) {
      $ionicPlatform.ready(function() {

        /* iOS TouchID 설정 */
        // $cordovaTouchID.checkSupport().then(function() {
        //     $cordovaTouchID.authenticate("You must authenticate").then(function() {
        //         alert("The authentication was successful");
        //     }, function(error) {
        //         console.log(JSON.stringify(error));
        //     });
        // }, function(error) {
        //     console.log(JSON.stringify(error));
        // });

        //$rootScope.isShowBackButton = false;
        var deviceInformation = ionic.Platform.device();

        var isWebView = ionic.Platform.isWebView();
        var isIPad = ionic.Platform.isIPad();
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var isWindowsPhone = ionic.Platform.isWindowsPhone();

        var currentPlatform = ionic.Platform.platform();
        var currentPlatformVersion = ionic.Platform.version();

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          $cordovaStatusbar.overlaysWebView(true);
          $cordovaStatusbar.style(1);
          $cordovaStatusbar.styleColor('black');
          $cordovaStatusbar.styleHex('#000');

          // org.apache.cordova.statusbar required
//StatusBar.styleDefault();
          // StatusBar.style(3);

          //   $cordovaStatusbar.overlaysWebView(true)

            // $cordovaStatusBar.style(1) //Light
//$cordovaStatusBar.style(2) //Black, transulcent
            // $cordovaStatusBar.style(3) //Black, opaque
            // $cordovaStatusbar.styleColor('black')

            // $cordovaStatusbar.styleHex('#FF0000') //red
        }
        window.addEventListener("orientationchange", function() {
          console.log(window.orientation);
        }, false);  
        // function doOnOrientationChange()
        // {
        //   switch(window.orientation) 
        //   {  
        //     case -90:
        //     case 90:
        //       alert('landscape');
        //       break; 
        //     default:
        //       alert('portrait');
        //       break; 
        //   }
        // }

        // window.addEventListener('orientationchange', doOnOrientationChange);


        document.addEventListener("resume", function() {
            console.log("The application is resuming from the background");
        }, false);
        document.addEventListener("pause", function() {
            console.log("The application was paused");
        }, false);

        // TODO 종료 여부 확인

        // document.addEventListener("online", function() {
        //     console.log("The network is online");
        // }, false);        
        // document.addEventListener("offline", function() {
        //     console.log("The network is offline");
        // }, false);

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          // 수강중인 강좌 메뉴 진입시
          if (toState.name.indexOf('myclass.') > -1) {
            $rootScope.isShowBackButton = true; //뒤로가기 버튼

            // 온라인 자격시험 메뉴 진입시
            if (toState.name.indexOf('myclass.exam') > -1) {
              jQuery('#mainHeader').show();//상단 메인 헤더 보임
              jQuery('#courseMenu').hide();// 수강중인 강좌 서브 메뉴 숨김
              jQuery('#footerTab').show();// 하단 푸터 메뉴 보임
            // 학습창 진입시
            }else if (toState.name.indexOf('myclass.learningPlayer') > -1) {
              jQuery('#mainHeader').hide();//상단 메인 헤더 숨김
              jQuery('#courseMenu').hide();// 수강중인 강좌 서브 메뉴 숨김
              jQuery('#footerTab').hide();// 하단 푸터 메뉴 숨김
            }else {
              jQuery('#mainHeader').show();//상단 메인 헤더 보임
              jQuery('#courseMenu').show();// 수강중인 강좌 서브 메뉴 보임
              jQuery('#footerTab').show();// 하단 푸터 메뉴 보임
            };
          }else {
            jQuery('#mainHeader').show();//상단 메인 헤더 보임
            jQuery('#courseMenu').hide();// 수강중인 강좌 서브 메뉴 숨김
            jQuery('#footerTab').show();// 하단 푸터 메뉴 보임
            $rootScope.isShowBackButton = false;
          };
          // 이동할 페이지가 사용자 인증이 필요한 경우, authenticate, 로그인 여부값이 있는지 확인해서 라우팅한다.
          if( toState.authenticate && !sessionSvc.isUserSignedIn()){
            console.log("The user is not authenticated.");
            event.preventDefault();
            $state.go('login');
            
          }else {
            console.log("The user is authenticated.");
            if (toState.name == 'login' && sessionSvc.isUserSignedIn()) {
              event.preventDefault();
              $state.go(env.LOGIN_MAIN);
            };
          }
        });
      });
    }
  ]);
});
