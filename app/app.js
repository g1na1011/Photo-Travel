'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.home'
])
.config(['$routeProvider', function($routeProvider) {
  // set default view of our app to home
  $routeProvider
  .otherwise({
    redirectTo: '/home'
  })
}]);