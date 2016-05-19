define([
  'app'
], function (app) {
  'use strict';

  app.filter('asterisk', 
    function () {
      return function(item, startIndex) {
        if (item == undefined|| item == null) return;
        var asterisk = '';
        if (startIndex == undefined || startIndex == null) var startIndex = 2;
        for (var i = startIndex ; i < item.length ; i++) {
          asterisk += '*';
        };
        return item.substring(0, startIndex) + asterisk;
      };
    }
  );
});
