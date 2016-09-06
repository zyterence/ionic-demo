angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $http) {

  $scope.loginData = {};
  $scope.message = "";

  function loginWithData(params, callback) {
    $http.get('http://httpbin.org/get', {
      params: params
    }).success(function(response) {
      console.log(response.args);
      callback()
    });
  }

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-left'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    var username = $scope.loginData.username;
    var password = $scope.loginData.password;
    if (username != "yang" || password != "123456") {
      $scope.message = "登录失败！"
      return
    }
    var params = {
      'username': username,
      'password': password
    }
    loginWithData(params, function() {
      console.log('login succeed!');
      $scope.closeLogin();
    });
  };
})

.controller('RedditCtrl', function($http, $scope) {

  $scope.stories = [];

  function loadStories(params, callback) {
    var stories = [];
    $http.get('https://www.reddit.com/new/.json', {
      params: params
    }).success(function(response) {
      angular.forEach(response.data.children, function(child) {
        stories.push(child.data);
      });
      callback(stories)
    });
  }

  $scope.loadMore = function() {
    params = {};
    var length = $scope.stories.length
    if (length > 0) {
      params['after'] = $scope.stories[length - 1].name
    }
    loadStories(params, function(olderStories) {
      $scope.stories = $scope.stories.concat(olderStories);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.doRefresh = function() {
    params = {
      'before': $scope.stories[0].name
    };
    loadStories(params, function(newerStories) {
      $scope.stories = newerStories.concat($scope.stories);
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
});
