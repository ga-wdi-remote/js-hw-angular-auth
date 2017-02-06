angular.module('giphyAngularApp', ['ui.router'])
  .config(GiphyRouter);

function GiphyRouter($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('index', {
    url: '/'
  })
  .state('login', {
    url: '/login',
    templateUrl: '/partials/login.html'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: '/partials/signup.html'
  });
}
