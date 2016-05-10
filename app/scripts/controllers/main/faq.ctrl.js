define([
  'app'
], function (app) {
  'use strict';

  app.controller('FaqCtrl', [
    '$scope',
    'ApiSvc',
    function ($scope, apiSvc) {
    	
    	$scope.doRefresh = function() {
    		console.log('doRefresh... ');
    	};

    	$scope.onPulling = function() {
    		console.log('onPulling... actions here...');
    	};
      // FAQ 목록
      $scope.doFaqList = function () {
        apiSvc.call('doFaqList').then(function(res) {
          if (res != null && res.DATA != null) {
            return res.DATA;
          };
        });
      };

//TODO 샘플
  $scope.items = [{
      title: '파본/훼손/오발송된 상품을 교환하고 싶습니다. 어떻게 해야하나요?',
      text: '일반 택배로 배송 받으신 상품에 하자가 있는 경우, 인터넷 홈페이지에서 배송 완료일로 부터 30일 이내 마이룸 > 주문/ 배송내역 > 주문상세페이지 > 교환신청 가능합니다. (※ 단, 우편/ 편의점택배 수령의 경우 회수주소지 정보에 일반 주소지 입력해 주시면 일반택배로 맞교환 진행됩니다.) 또는, 고객센터 1:1상담에서 <파본/ 상품불량 신고> 또는 <반품/교환/환불> 상담에 주문번호와 내용을 기재하여 주십시오. 담당자 확인 후 주문시의 주소로 상품을 재발송 해 드립니다. 파본도서는 재발송 된 상품을 받으시면서 맞교환해주시면 됩니다.'
    },{
      title: '파본/훼손/오발송된 상품을 교환하고 싶습니다. 어떻게 해야하나요?',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '파본/훼손/오발송된 상품을 교환하고 싶습니다. 어떻게 해야하나요?',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '파본/훼손/오발송된 상품을 교환하고 싶습니다. 어떻게 해야하나요?',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },{
      title: '파본/훼손/오발송된 상품을 교환하고 싶습니다. 어떻게 해야하나요?',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit'
  }];
  $scope.faqList = $scope.items;


              /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(group) {
          if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
          } else {
            $scope.shownGroup = group;
          }
        };
        $scope.isGroupShown = function(group) {
          return $scope.shownGroup === group;
        };
    }


  ]);
});
