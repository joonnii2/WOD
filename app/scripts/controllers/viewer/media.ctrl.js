define([
  'app'
  ,'services/viewer/media.svc'
  ,'videoJs'
  ,'vjsVideo'
  ,'controllers/viewer/media_controller'
], function (app) {
  'use strict';

  app.controller('MediaCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    '$cordovaMedia',
    'MediaSvc',
    '$ionicModal',
    '$ionicPlatform',
    '$window',
    '$ionicLoading',
    '$timeout',
    function ($scope, $state, $stateParams, $ionicHistory, $cordovaMedia, mediaSvc, $ionicModal, $ionicPlatform, $window, $ionicLoading, $timeout) {
    	console.log('media controller');
// $scope.$on('$ionicView.beforeEnter', function(){
// window.screen.lockOrientation('landscape');
// });

      $ionicPlatform.ready(function() {
        console.log('$ionicPlatform.ready');
        if (window.cordova && window.screen) {
          console.log('window.screen');
          console.log(window.screen);
          window.screen.lockOrientation('landscape');
         
        }
        document.addEventListener("resume", function() {
            console.log("The Media Player is resuming from the background");
        }, false);
        document.addEventListener("pause", function() {
            console.log("The Media Player was paused");
        }, false);
      });
      // var audioSrc = 'love_never_felt_so_good.mp3';
      // var media = $cordovaMedia.newMedia(audioSrc);
      // var iOSPlayOptions = {
      //   numberOfLoops: 2,
      //   playAudioWhenScreenIsLocked : false
      // };
      // //media.play(iOSPlayOptions); // iOS only!

      // $scope.playMedia = function() {
      //   media.play();
      // };

      // $scope.pauseMedia = function() {
      //    media.pause();
      // };

      // $scope.stopMedia = function() {
      //    media.stop();
      // };

      // $scope.$on('destroy', function() {
      //    media.release();
      // });
    $scope.onTouch = function() {
      if (jQuery('#infoPanel').css('display') == 'none') {
        jQuery('#infoPanel').slideDown();
        jQuery('#controllPanel').slideDown();
        $timeout(function() {
          jQuery('#infoPanel').slideUp();
          jQuery('#controllPanel').slideUp();
        }, 5000, true);
      }else {
        jQuery('#infoPanel').slideUp();
        jQuery('#controllPanel').slideUp();
      };
    };


    $scope.showControll = function() {
      //$('#playerHeader').show();
      //angular.element(document.querySelector('#playerHeader')).show();
      if (jQuery('#menuPanel').css('display') == 'none') {
        jQuery('#infoPanel').slideDown();
        jQuery('#controllPanel').slideDown();
      };
      $timeout(function() {
        jQuery('#infoPanel').slideUp();
        jQuery('#controllPanel').slideUp();
      }, 3000, true);
    };
    $scope.hideControll = function () {
      //$('#playerHeader').hide();
      //angular.element(document.querySelector('#playerHeader')).hide();
      jQuery('#infoPanel').slideUp();
      jQuery('#controllPanel').slideUp();
    };
    $scope.menuToggle = function () {
      if (jQuery('#menuPanel').css('display') == 'none') {
        $scope.hideControll();
      };
      jQuery('#menuPanel').toggle('slide');
    };
    $scope.goPrevious = function () {

    };
    $scope.goNext = function () {

    };
    $scope.play = function () {
      mediaController.play();
    };
    $scope.pause = function() {
      mediaController.pause();
    };
    $scope.getCurrentTime = function() {
      console.log(mediaController.currentTime());
    }
    var mediaController = {
      media : document.getElementById('media'),
      play : function () {
        this.media.play();
      },
      pause : function () {
        this.media.pause();
        console.log(this.currentTime());
      },
      setTime : function(tValue) {
        try {
          if (tValue == 0) {
            this.media.currentTime = tValue;
          }else {
            this.media.currentTime += tValue;
          }
        }catch (err) {
          console.log(err);
        }
      },
      toggleMute : function() {
        if (this.media.muted) this.media.muted = false;
        else this.media.muted = true;
      },
      currentTime : function () {
        this.media.currentTime;
      }
    };


    $scope.files = [];
 
    $ionicModal.fromTemplateUrl('templates/viewer/mediaPlayer.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
 
    $scope.hidePlayer = function() {
      $scope.modal.hide();
    };
 
    $scope.player = function() {
      $scope.modal.show();
    };
    $scope.toggle = function(text, timeout) {
      $scope.show(text);
 
      setTimeout(function() {
        $scope.hide();
      }, (timeout || 1000));
    };
    $scope.show = function(text) {
      $ionicLoading.show({
        template: text
      });
    };
 
    $scope.hide = function() {
      $ionicLoading.hide();
    };
    $ionicPlatform.ready(function() {
 
      $scope.show('Accessing Filesystem.. Please wait');
      window.requestFileSystem = $window.requestFileSystem || $window.webkitRequestFileSystem;
      window.requestFileSystem($window.PERSISTENT, 0, function(fs) {
          //console.log("fs", fs);
 
          var directoryReader = fs.root.createReader();
 
          directoryReader.readEntries(function(entries) {
              var arr = [];
              processEntries(entries, arr); // arr is pass by refrence
              $scope.files = arr;
              $scope.hide();
            },
            function(error) {
              console.log(error);
            });
        },
        function(error) {
          console.log(error);
        });
 
      $scope.showSubDirs = function(file) {
 
        if (file.isDirectory || file.isUpNav) {
          if (file.isUpNav) {
            processFile(file.nativeURL.replace(file.actualName + '/', ''));
          } else {
            processFile(file.nativeURL);
          }
        } else {
          if (hasExtension(file.name)) {
            if (file.name.indexOf('.mp4') > 0) {
              // Stop the audio player before starting the video
              $scope.stopAudio();
              VideoPlayer.play(file.nativeURL);
            } else {
              fsResolver(file.nativeURL, function(fs) {
                //console.log('fs ', fs);
                // Play the selected file
                AudioSvc.playAudio(file.nativeURL, function(a, b) {
                  //console.log(a, b);
                  $scope.position = Math.ceil(a / b * 100);
                  if (a < 0) {
                    $scope.stopAudio();
                  }
                  if (!$scope.$$phase) $scope.$apply();
                });
 
                $scope.loaded = true;
                $scope.isPlaying = true;
                $scope.name = file.name;
                $scope.path = file.fullPath;
 
                // show the player
                $scope.player();
 
                $scope.pauseAudio = function() {
                  AudioSvc.pauseAudio();
                  $scope.isPlaying = false;
                  if (!$scope.$$phase) $scope.$apply();
                };
                $scope.resumeAudio = function() {
                  AudioSvc.resumeAudio();
                  $scope.isPlaying = true;
                  if (!$scope.$$phase) $scope.$apply();
                };
                $scope.stopAudio = function() {
                  AudioSvc.stopAudio();
                  $scope.loaded = false;
                  $scope.isPlaying = false;
                  if (!$scope.$$phase) $scope.$apply();
                };
 
              });
            }
          } else {
            $scope.toggle('Oops! We cannot play this file :/', 3000);
          }
 
        }
 
      }
 
      function fsResolver(url, callback) {
        $window.resolveLocalFileSystemURL(url, callback);
      }
 
      function processFile(url) {
        fsResolver(url, function(fs) {
          //console.log(fs);
          var directoryReader = fs.createReader();
 
          directoryReader.readEntries(function(entries) {
              if (entries.length > 0) {
                var arr = [];
                // push the path to go one level up
                if (fs.fullPath !== '/') {
                  arr.push({
                    id: 0,
                    name: '.. One level up',
                    actualName: fs.name,
                    isDirectory: false,
                    isUpNav: true,
                    nativeURL: fs.nativeURL,
                    fullPath: fs.fullPath
                  });
                }
                processEntries(entries, arr);
                $scope.$apply(function() {
                  $scope.files = arr;
                });
 
                $ionicScrollDelegate.scrollTop();
              } else {
                $scope.toggle(fs.name + ' folder is empty!', 2000);
              }
            },
            function(error) {
              console.log(error);
            });
        });
      }
 
      function hasExtension(fileName) {
        var exts = ['.mp3', '.m4a', '.ogg', '.mp4', '.aac'];
        return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
      }
 
      function processEntries(entries, arr) {
 
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
 
          // do not push/show hidden files or folders
          if (e.name.indexOf('.') !== 0) {
            arr.push({
              id: i + 1,
              name: e.name,
              isUpNav: false,
              isDirectory: e.isDirectory,
              nativeURL: e.nativeURL,
              fullPath: e.fullPath
            });
          }
        }
        return arr;
      }
 
    });
    }
  ]);
});