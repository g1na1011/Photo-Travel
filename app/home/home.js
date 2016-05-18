'use strict';

angular.module('myApp.home', ['ngRoute'])

// declared routes
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeController'
  })
}])

.factory('flickr', ['$http', function($http) {
  return {
    fetchImg: function(cb, destinationTag) {
      $http({
        method: 'POST',
        url: '/home',
        data: {destinationTag: destinationTag}
      })
      .then(function success(response) {
        cb(response.data);
      })
      .catch(function() {
        console.error('error during IG API fetch');
      });
    }
  }
}])

// home controller
.controller('HomeController', ['$scope', 'flickr', '$http', function($scope, flickr, $http) {
  $scope.bookmarks = [];

  $scope.editTag = function(tag) {
    return tag.replace(/\s/g, '+');
  },

  $scope.getImg = function() {
    flickr.fetchImg(function(data) {
      $scope.photoStream = data;
      $scope.displayObjects = {};
      $scope.photoUrls = $scope.getPhotoUrl($scope.photoStream);
      $scope.locationTags = $scope.getTags($scope.photoStream);

      for (var urlId in $scope.photoUrls) {
        for (var tagId in $scope.locationTags) {
          if (urlId === tagId) {
            $scope.displayObjects[$scope.photoUrls[urlId]] = $scope.locationTags[tagId];
          }
        }
      }
    }, $scope.editTag($scope.destination));
  },

  $scope.getPhotoUrl = function(photoList) {
    var photoUrls = {};
    photoList.forEach(function(photo) {
      photoUrls[photo.flickr.id] = `https://farm${photo.flickr.farm}.staticflickr.com/${photo.flickr.server}/${photo.flickr.id}_${photo.flickr.secret}.jpg`; 
    });
    return photoUrls;
  },

  $scope.getTags = function(photoList) {
    var locationTags = {};
    photoList.forEach(function(photo) {
      if (photo.photo.location.neighbourhood) {
        locationTags[photo.flickr.id] = photo.photo.location.neighbourhood._content;
      } else if (photo.photo.location.county) {
        locationTags[photo.flickr.id] = photo.photo.location.county._content;
      } else if (photo.photo.location.region) {
        locationTags[photo.flickr.id] = photo.photo.location.region._content;
      } else {
        locationTags[photo.flickr.id] = photo.photo.location.country._content;
      }
    })
    return locationTags;
  },

  $scope.appendBookmark = function(item) {
    if ($scope.bookmarks.indexOf(item) === -1) {
      $scope.bookmarks.push(item);
    }
    if ($scope.bookmarks.length > 0) {
      $scope.bookmarkShow = true;
    } else {
      $scope.bookmarkShow = false;
    }
  },

  $scope.removeItem = function(item) {
    var index = $scope.bookmarks.indexOf(item);
    console.log(index);
    $scope.bookmarks.splice(index, 1);
  } 
}]);
