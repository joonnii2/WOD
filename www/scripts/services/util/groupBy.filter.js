define([
  'app'
], function (app) {
  'use strict';

  app.filter('groupBy', 
    function () {
      return function(items, group) {
        return items.filter(function(element, index, array) {
          return parseInt(element.time) == group;
        });
      }
    }
  ]);
});
