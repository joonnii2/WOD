define([
  'app'
], function (app) {
  'use strict';

  app.controller('TocCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$rootScope',
    'ApiSvc',
    '$ionicLoading',
    'ENV',
    '$ionicTabsDelegate',
    '$ionicPlatform',
    '$ionicScrollDelegate',
    function ($scope, $state, $stateParams, $rootScope, apiSvc, $ionicLoading, env, $ionicTabsDelegate, $ionicPlatform, $ionicScrollDelegate) {

      // // 모바일에서 사용가능한 학습 자원 유형
      // var ENABLE_CONNGB_TYPE = [
      //   //'0001', // 동영상 파일
      //   '0002', // 동영상 CDN
      //   //'0003', // 음성 파일
      //   '0004', // 오디오 CDN
      //   '0008', // 웹 링크 유형
      //   '0009', // 웹 콘텐츠 유형
      //   '1009'  // 평가 유형
      // ];
      $ionicTabsDelegate.select(0); // 강의실 상단 탭 순번 지정
      var CONNGB_TYPE = {
        '0001' : '동영상 파일',
        '0002' : '동영상 스트리밍',
        '0003' : '음성 파일',
        '0004' : '음성 스트리밍',
        '0005' : '이미지 파일',
        '0006' : '플래시 파일',
        '0007' : '일반 파일',
        '0008' : '웹링크',
        '0009' : '웹 콘텐츠',
        '0010' : '기타 파일',
        '0011' : 'APIP',
        '0012' : 'IWB',
        '0013' : 'EPUB',
        '0014' : 'QTI',
        '0101' : '유닛',
        '0102' : '유닛 아이템',
        '1001' : '토론',
        '1002' : '일반 게시판',
        '1003' : '공지 게시판',
        '1004' : 'Q&A 게시판',
        '1005' : '1:1 게사판',
        '1006' : '자료 게시판',
        '1007' : '일정 게시판',
        '1008' : '과제',
        '1009' : '시험',
        '1010' : '설문',
        '1011' : '콘텐츠 에디터',
        '1012' : '구글 Docs',
        '1013' : 'LTI',
        '1014' : '출석수업'
      };

      var POBT_TYPE = {
        '01' : '학습 시간',
        '02' : '학습 시작시',
        '03' : '제출/응시',
        '04' : '글작성',
        '05' : '없음'
      };

      // 모바일용 학습자원 인지 여부
      $scope.isEnabled = function(toc) {
        if (toc.tocTypeGb == '02' && env.ENABLE_CONN_GB.indexOf(toc.connGb) > -1) return true;
        else return false;
      };

      $scope.doRefresh = function() {$scope.$broadcast('scroll.refreshComplete');};
      $scope.onPulling = function() {$state.current.name == 'myclass.tocList' ? doTocList($stateParams) : doItemDetail($stateParams);};

      if ($stateParams.lectureName != undefined && $stateParams.lectureName != null) $scope.lectureName = $stateParams.lectureName;

      // 학습 목차
      if ($state.current.name == 'myclass.tocList') {

        $scope.isGroupShown = function(wsSeqno) {return $scope.shownGroup === wsSeqno;};
        $scope.toggleGroup = function(wsSeqno) {
          if ($scope.isGroupShown(wsSeqno)) $scope.shownGroup = null;
          else $scope.shownGroup = wsSeqno;

          if (jQuery('#ws_'+wsSeqno).attr('data-index') != undefined && jQuery('#ws_'+wsSeqno).attr('data-index') != null) {
            $ionicScrollDelegate.scrollTo(0, ((jQuery('#ws_'+wsSeqno).attr('data-index')*55) + 58));
          };
        };

        $scope.setTocStyle = function(toc) {
          var style = 'indent_'+toc.tocDepth;
          if (toc.tocTypeGb == '02' && $scope.isEnabled(toc)) style = 'toc_enabled ion-ipad ' + style;
          else style = 'toc_disabled ' + style;
          return style;
        };

        $scope.goItemDetail = function(toc) {
          $stateParams.tocSeqno = toc.tocSeqno;               // 학습목차 일련번호
          $stateParams.connGb = toc.connGb;                   // 학습자원 종류
          $stateParams.viewingYn = toc.viewingYn;             // 학습창 보기 가능 유무
          $stateParams.viewerWidthSize = toc.viewerWidthSize; // 학습창 넓이
          $stateParams.viewerHgtSize = toc.viewerHgtSize;     // 학습창 높이
          $stateParams.precdTocUseYn = toc.precdTocUseYn;     // 선행학습 사용여부
          $stateParams.precdTocSeqno = toc.precdTocSeqno;     // 선행학습 목차
          $stateParams.precdTocPobtYn = toc.precdTocPobtYn;   // 선행학습 완료 여부
          $stateParams.tocName = toc.tocName;                 // 목차타이틀
          $stateParams.mobileConnPk = toc.mobileConnPk;       // 모바일 리소스 연계 키
          $stateParams.viewerRunYn = toc.viewerRunYn          // 학습창내 실행 여부(학습창/새창 여부)
          $stateParams.wsSeqno = toc.wsSeqno                  // 주차 일련번호

          $state.go('myclass.itemDetail', $stateParams);
        };

        $ionicPlatform.ready(function() {

          doTocList($stateParams);
        });
      // 학습 목차 상세
      }else if ($state.current.name == 'myclass.itemDetail') {

        $scope.tocName = $stateParams.tocName;

        /* 학습 가능 여부 체크 시작 */
        $scope.isLearnableToc = true;
        $scope.learnableMsg = '';
        // 1.모바일 학습 자원이 존재할 경우만 버튼 노출
        if ($stateParams.mobileConnPk == undefined || $stateParams.mobileConnPk == '') {
          $scope.isLearnableToc = false;
          $scope.learnableMsg = '* 모바일 학습 자원이 등록되어 있지 않습니다.';
        };
        // 2.모바일 학습 가능한 자원 유형일 경우만 버튼 노출
        if ($stateParams.connGb == undefined || env.ENABLE_CONN_GB.indexOf($stateParams.connGb) == -1) {
          $scope.isLearnableToc = false;
          $scope.learnableMsg = '* 모바일 학습 환경을 지원하지 않는 학습 목차 입니다.';
        };
        // 3.선행학습 이수 여부
        if ($stateParams.precdTocUseYn != undefined && $stateParams.precdTocUseYn == 'Y') {
          if ($stateParams.precdTocPobtYn == undefined || $stateParams.precdTocPobtYn != 'Y') {
            $scope.isLearnableToc = false;
            $scope.learnableMsg = '* 선행 학습 목차를 먼저 완료하셔야 진행하실 수 있습니다.';
          };
        };
        // 4.서비스 기간에 따른 학습창 서비스 가능할 경우만 버튼 노출 (Y:기간이 지나지 않았음, N:기간이 지났음)
        if ($stateParams.viewingYn == undefined || $stateParams.viewingYn != 'Y') {
          $scope.isLearnableToc = false;
          $scope.learnableMsg = '* 학습 가능한 기간이 아닙니다.';
        };
        // 5.모바일 지원 강좌의 경우만 버튼 노출
        if ($stateParams.mobilePosbYn == undefined || $stateParams.mobilePosbYn != 'Y') {
          $scope.isLearnableToc = false;
          $scope.learnableMsg = '* 모바일 학습 환경을 지원하지 않는 강좌 입니다.';
        };
        if ($scope.isLearnableToc) jQuery('.btn_area').show();
        else jQuery('.btn_area').hide();
        /* 학습 가능 여부 체크 끝 */

        doItemDetail($stateParams);

        $scope.goStudy = function() {

          $stateParams.prgssRateCompleteBasis = $scope.itemDetail.prgssRateCompleteBasis;  // 콘텐츠 이수 기준 진도율
          $stateParams.pobtTypeGb = $scope.itemDetail.pobtTypeGb; // 콘텐츠 학습 완료 기준 구분
          $stateParams.tocEdTime = $scope.itemDetail.tocEdTime; // 콘텐츠 권장 학습시간
          $stateParams.pobtYn = $scope.itemDetail.pobtYn;       // 콘텐츠 학습 완료 여부
          //'2','https://www.youtube.com/embed/4iHlfXHnN94?autoplay=1'
          // if ($scope.itemDetail != null) {
          //   //$stateParams.itemId = $scope.itemDetail.itemId;
          //   $stateParams.contentsUrl = $scope.itemDetail.contentsUrl;
          //   //$stateParams.width = $scope.itemDetail.width;
          //   //$stateParams.height = $scope.itemDetail.height;
          //   $stateParams.poster = $scope.itemDetail.poster;
          // }

          // if ($stateParams.itemId == '1') {
          //         // TODO 임시 테스트 - SCU 웹콘텐츠
          //   //$stateParams.itemId = 2;
          //   $stateParams.contentsType = 'WEB';
          //   $stateParams.contentsUrl = 'http://stream.iscu.ac.kr/stream/Contents/IC0409/1/IC0409_1_1.asp';
          //   //$stateParams.contentsUrl = 'http://192.168.0.19:8080/edu.scu';
          //   //$stateParams.contentsUrl = 'http://wod.iscu.ac.kr/edu.scu';
          //   $stateParams.width = '560';
          //   $stateParams.height = '315';
          //   $stateParams.poster = 'http://vjs.zencdn.net/v/oceans.png';
          // }else if ($stateParams.itemId == '2') {
          //       // TODO 임시 테스트 - 유튜브동영상
          //   //$stateParams.itemId = 2;
          //   $stateParams.contentsType = 'URL';
          //   $stateParams.contentsUrl = 'https://www.youtube.com/embed/4iHlfXHnN94?autoplay=1';
          //   $stateParams.width = '560';
          //   $stateParams.height = '315';
          //   $stateParams.poster = 'http://vjs.zencdn.net/v/oceans.png';
          // }else if ($stateParams.itemId == '3') {
          //       // TODO 임시 테스트 - 시험
          //   //$stateParams.itemId = 2;
          //   $stateParams.contentsType = 'EXAM';
          //   $stateParams.contentsUrl = 'http://wave.jicsaw.com';
          //   //$stateParams.contentsUrl = 'http://192.168.0.19:8080/edu.scu';
          //   //$stateParams.contentsUrl = 'http://wod.iscu.ac.kr/edu.scu';
          //   $stateParams.width = '560';
          //   $stateParams.height = '315';
          //   $stateParams.poster = 'http://vjs.zencdn.net/v/oceans.png';
          // }else if ($stateParams.itemId == '4') {
          //   // TODO 임시 테스트 - SCU 동영상
          //   //$stateParams.itemId = 2;
          //   $stateParams.contentsType = 'VIDEO';
          //   $stateParams.contentsUrl = 'http://mp4.iscu.ac.kr/iscu/Contents/13110001/289778/1028548/13110001_1_01.mp4';
          //   $stateParams.width = '1080';
          //   $stateParams.height = '920';
          //   $stateParams.poster = 'http://vjs.zencdn.net/v/oceans.png';
          // }

          $state.go('myclass.learningPlayer', $stateParams);
        };
      };

      // 주차 목록 조회
      function doTocList(param) {
        apiSvc.call('doTocList', param).then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            //$scope.tocList = res.LIST; // 학습목차 목록
            $scope.wsList = setWsList(res.LIST); // 주차 목록

            if ($stateParams.scrollTo == undefined || $stateParams.scrollTo == null) {
              $scope.toggleGroup($scope.wsList[0].ws.wsSeqno);
            }else {
              $scope.toggleGroup($stateParams.scrollTo);
            };
          }
        }, function(err) {
        });
      };

      // 주차별 학습목차 그룹핑
      function setWsList(tocList) {
        var wsList = [];
        angular.forEach(tocList, function (toc, idx) {
          // 주차
          if (toc.kind == 1) {
            wsList.push({ws : toc, tocList : []});

          // 학습목차
          }else {
            var continueLoop = true;
            angular.forEach(wsList, function(ws, i) {
              if (continueLoop) {
                if (ws.ws.wsSeqno == toc.wsSeqno) {
                  ws.tocList.push(toc);
                  continueLoop =false;
                }else {
                  if (i == (wsList.length -1)) {
                    wsList.push({ws : toc, tocList : []});
                  };
                };
              };
            });
          }
        });
        console.log(wsList);
        return wsList;
      };

      // 학습목차 목록 조회
      function doItemList(param) {
        apiSvc.call('doItemList', param).then(function(res) {
          if (res != null && res.LIST != null) {
            console.log('LIST received.');
            console.log(res.LIST);
            $scope.itemList = res.LIST; // 학습목차 목록
          }
        });
      };

      // 학습목차 상세 조회
      function doItemDetail(param) {
        apiSvc.call('doItemDetail', param).then(function(res) {
          if (res != null && res.DATA != null) {
            console.log('DATA received.');
            console.log(res.DATA);
            $scope.itemDetail = res.DATA; // 학습목차 상세 정보
            $scope.itemDetail.connGbName = CONNGB_TYPE[$stateParams.connGb];
            $scope.itemDetail.tocEdTimeTxt = getTime($scope.itemDetail.tocEdTime);
            $scope.itemDetail.tocAttendBasisTimeTxt = setTime($scope.itemDetail.tocEdTime, $scope.itemDetail.prgssRateCompleteBasis);
            $scope.itemDetail.pobtTypeName = POBT_TYPE[$scope.itemDetail.pobtTypeGb];
            $scope.itemDetail.learnTimeSumTxt = getTime($scope.itemDetail.learnTimeSum);
            $scope.itemDetail.prgss = parseInt($scope.itemDetail.prgss);
          }
        });
      };

      // 출석인정기준 시간 설정
      function setTime(sec, prgssRateCompleteBasis) {
        var retTime = '';
        if (prgssRateCompleteBasis != null && parseInt(prgssRateCompleteBasis) > 0 && sec != null && parseInt(sec) > 0) {
          retTime = getTime(parseInt(sec*prgssRateCompleteBasis/100)) + ' 이상';
        }else {
          retTime = '100 %';
        };
        return retTime;
      };

      // 초 > 시간 변환
      function getTime(sec) {
        var retTime = '';
        if (sec != undefined && sec != null && sec !== '0' && sec != '') {
          var ss = parseInt(sec); ss = ss%60 + ' 초';
          var mm = parseInt(parseInt(sec)/60);
          if (mm > 60) {
            var hh = parseInt(parseInt(mm)/60); mm = parseInt(mm)%60;
            retTime = hh + ' 시간 ';
          };
          if (mm > 0) retTime += mm+' 분 '+ss;
          else retTime = ss;
        }else {
          retTime = '0 초';
        };
        return retTime;
      };
    }
  ]);
});
