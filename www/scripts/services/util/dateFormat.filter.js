define([
  'app'
], function (app) {
  'use strict';

  app.filter('dateFormat', 
    function () {
      return function(str, sep) {
      	if (str == undefined || str == null) return;
        return str.substring(0,4) + sep + str.substring(4, 6) + sep + str.substring(6, 8);
      };
    }
  );
});
