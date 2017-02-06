angular.module('giphyAngularApp', ['ui.router'])
  .config(GiphyRouter);

function GiphyRouter($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: '/partials/home.html'
  })
  .state('login', {
    url: '/login',
    templateUrl: '/partials/login.html'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: '/partials/signup.html'
  })
  .state('user', {
    url: '/user/:id',
    templateUrl: '/partials/user.html'
  })
  .state('updateGif', {
    url: '/update-gif/:gifId',
    templateUrl: '/partials/update_gif.html'
  });
}
