define([
  'app',
  // Load Controllers here
  //'controllers/main/home.ctrl'
  'controllers/main/login.ctrl'
  ,'controllers/main/search.ctrl'
  ,'controllers/main/message.ctrl'
  //,'controllers/main/intro.ctrl'
  ,'controllers/main/faq.ctrl'
  ,'controllers/main/counseling.ctrl'
  ,'controllers/main/notice.ctrl'
  ,'controllers/menu/menu.ctrl'
  ,'controllers/main/setting.ctrl'
  ,'controllers/myclass/course.ctrl'
  ,'controllers/myclass/toc.ctrl'
  ,'controllers/myclass/qna.ctrl'
  ,'controllers/myclass/exam.ctrl'
  ,'controllers/myclass/notice.ctrl'
  ,'controllers/viewer/viewer.ctrl'
  ,'controllers/viewer/media.ctrl'
], function (app) {
  'use strict';
	// definition of routes
	app.config([
		'$stateProvider',
		'$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {

			// url routes/states
			$urlRouterProvider.otherwise('/');

			$stateProvider
			// 로그인전 메인화면(메뉴 포함)
			.state('login', {
				url: '/',
				templateUrl: 'templates/main/login.html',
				controller: 'LoginCtrl',
				authenticate : false,
				cache : false,
				onEnter: function($state) {
					console.log('onEnter');
				}
			})
			// 시스템 알림
			.state('message', {
				url: '/message/:messageId?messageData&messageAction',
				templateUrl: 'templates/main/message.html',
				controller: 'MessageCtrl',
				authenticate : false
			})
			// 로그인전 아이디/비밀번호 찾기
			.state('search', {
				url: '/search',
				templateUrl: 'templates/main/search.html',
				controller: 'SearchCtrl',
				authenticate : false
			})
			// // 로그인전 아이디 찾기
			// .state('searchId', {
			// 	url: '/searchId',
			// 	templateUrl: 'templates/main/searchId.html',
			// 	controller: 'SearchCtrl',
			// 	authenticate : false
			// })
			// // 로그인전 비밀번호 찾기
			// .state('searchPw', {
			// 	url: '/searchPw',
			// 	templateUrl: 'templates/main/searchPw.html',
			// 	controller: 'SearchCtrl',
			// 	authenticate : false
			// })
			// 메인화면(메뉴 포함)
			.state('main', {
				url: '/main',
				abstract: true,
				templateUrl: 'templates/menu/mainMenu.html',
				controller: 'MenuCtrl',
				authenticate : true,
				cache : false
			})
/*			// 로그인전 포털 메인
			.state('main.home', {
				url: '/home',
				views: {
					'menuContent': {
						templateUrl: 'templates/main/home.html',
						controller: 'HomeCtrl'
					}
				}
			})*/
			// 메뉴 : 메인 공지사항 목록
			.state('main.noticeList', {
				url: '/noticeList',
				views: {
					'menuContent': {
						templateUrl: 'templates/main/mainNoticeList.html',
						controller: 'MainNoticeCtrl'
					}
				},
				authenticate : true,
				cache : false
			})
			// 메뉴 : FAQ 목록
			.state('main.faqList', {
				url: '/faqList',
				views: {
					'menuContent': {
						templateUrl: 'templates/main/faqList.html',
						controller: 'FaqCtrl'
					}
				},
				authenticate : true,
				cache : false
			})
			// 메뉴 : 나의 문의사항 목록
			.state('main.counselingList', {
				url: '/counselingList',
				views: {
					'menuContent': {
						templateUrl: 'templates/main/counselingList.html',
						controller: 'CounselingCtrl'
					}
				},
				authenticate : true,
				cache : false
			})
			// 하단 탭 : 설정
			.state('main.setting', {
				url : '/setting',
				views: {
					'menuContent': {
						templateUrl: 'templates/main/setting.html',
						controller: 'SettingCtrl'
					}
				},
				authenticate : true,
				cache : false
			})
			// 로그인 후 : 회원메뉴
			.state('myclass', {
				url : '/myclass',
				abstract: true,
				templateUrl: 'templates/menu/mainMenu.html',
				controller: 'MenuCtrl',
				authenticate : true,
				cache : false
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정
			.state('myclass.ingCourseList', {
				url: '/ingCourseList',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/ingCourseList.html',
						controller: 'CourseCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : 강의정보 
			.state('myclass.ingCourseDetail', {
				url: '/ingCourseDetail/:lectureSeqno',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/ingCourseDetail.html',
						controller: 'CourseCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : 학습하기 (주차 목록)
			.state('myclass.tocList', {
				url: '/tocList/:lectureSeqno?mobilePosbYn&lectureName',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/tocList.html',
						controller: 'TocCtrl'
					}
				},
				authenticate : true
			})
			// 학습목차 상세 정보 조회 : 일반강의 및 학습도구 류
			.state('myclass.itemDetail', {
				url: '/itemDetail/:tocSeqno?connGb&lectureSeqno&mobileConnPk&mobilePosbYn&serviceYn&viewerRunYn&viewerWidthSize&viewerHgtSize&precdTocUseYn&precdTocSeqno&precdTocPobtYn&tocName',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/itemDetail.html',
						controller: 'TocCtrl'
					}
				},
				authenticate : true
			})
			// 학습목차 상세 정보 조회 : 온라인 자격시험
			.state('myclass.examDetail', {
				url: '/examDetail/:examId',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/examDetail.html',
						controller: 'ExamCtrl'
					}
				},
				authenticate : true
			})
			// 학습목차 상세 정보 조회 : 온라인 자격시험 > 자격시험 정보
			.state('myclass.examInfo', {
				url: '/examInfo/:examId',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/examInfo.html',
						controller: 'ExamCtrl'
					}
				},
				authenticate : true
			})
			// 학습목차 상세 정보 조회 : 온라인 자격시험 > 자격시험 응시
			.state('myclass.examApplication', {
				url: '/examApplication/:examId',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/examApplication.html',
						controller: 'ExamCtrl'
					}
				},
				authenticate : true
			})
			// 학습목차 상세 정보 조회 : 온라인 자격시험 > 자격시험 결과
			.state('myclass.examResult', {
				url: '/examResult/:examId',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/examResult.html',
						controller: 'ExamCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : 공지사항 목록
			.state('myclass.noticeList', {
				url: '/noticeList/:lectureSeqno',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/noticeList.html',
						controller: 'NoticeCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : 공지사항 상세 조회
			.state('myclass.noticeDetail', {
				url: '/noticeDetail/:noticeId',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/noticeDetail.html',
						controller: 'NoticeCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : Q&A 목록
			.state('myclass.qnaList', {
				url: '/qnaList/:lectureSeqno',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/qnaList.html',
						controller: 'QnaCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : Q&A 조회
			.state('myclass.qnaDetail', {
				url: '/qnaDetail/:qnaId',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/qnaDetail.html',
						controller: 'QnaCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : Q&A 글쓰기
			.state('myclass.qnaWrite', {
				url: '/qnaWrite/:lectureSeqno',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/qnaWrite.html',
						controller: 'QnaCtrl'
					}
				},
				authenticate : true
			})
			// 로그인 후 : 회원메뉴 : 수강중인과정 : Q&A 글쓰기
			.state('myclass.qnaModify', {
				url: '/qnaModify/:qnaId',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'templates/myclass/qnaModify.html',
						controller: 'QnaCtrl'
					}
				},
				authenticate : true
			})
			.state('myclass.learningPlayer', {
				url: '/learningPlayer/:tocSeqno?connGb&mobileConnPk&viewerRunYn&viewerWidthSize&viewerHgtSize&tocName',
				views: {
					'menuContent': {
						templateUrl: 'templates/viewer/learningPlayer.html',
						controller: 'ViewerCtrl'
					}
				},
				cache: false,
				authenticate : true
			})
			// .state('learningPlayer', {
			// 	url: '/learningPlayer/:itemId?contentsType&width&height&contentsUrl&poster',
			// 	templateUrl: 'templates/viewer/learningPlayer.html',
			// 	controller: 'ViewerCtrl',
			// 	cache: false,
			// 	authenticate : true
			// })
			// // 학습창
			// .state('viewer', {
			// 	url: '/viewer/:itemId?contentsUrl',
			// 	templateUrl: 'templates/viewer/viewer.html',
			// 	controller: 'ViewerCtrl',
			// 	authenticate : true,
			// 	cache : false
			// })
			// 학습창 : HTML Viewer
			// // 학습창 : 미디어 플레이어
			// .state('viewer.media', {
			// 	url: '/media',
			// 	views: {
			// 		'viewerContent': {
			// 			templateUrl: 'templates/viewer/player.html',
			// 			controller: 'MediaCtrl'
			// 		}
			// 	},
			// 	authenticate : true,
			// 	cache : false
			// })
			// // 학습창 : 미디어 플레이어
			// .state('mediaPlayer', {
			// 	url: '/mediaPlayer',
			// 	templateUrl: 'templates/viewer/player.html',
			// 	controller: 'MediaCtrl',
			// 	authenticate : true,
			// 	cache : false
			// })
			;
		}
	]);

});
