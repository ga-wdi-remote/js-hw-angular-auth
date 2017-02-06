  angular.module('giphyAngularApp')
    .controller('HomeController', HomeController)
    .controller('AuthController', AuthController)

    HomeController.$inject = ['$http', '$state', '$scope'];
    //************************
    //HOME CONTROLLER
    //************************

    function HomeController($scope, $http) {
      var home = this;
      home.getGif = getGif;
      home.newGifUrl = "";

      $scope.$on('userLoggedIn', function(event, data){
        self.currentUser = data;
      });

      $scope.$on('userLoggedOut', function(event, data) {
        self.currentUser = null;
      });

      function getGif(){
        $http
        .get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&rating=pg')
        .then(function(giphyResponse) {
          console.log(giphyResponse.data)
           home.newGifUrl = giphyResponse.data.image_url;
        })

      }

      var saveGif = function() {
        var url = $('img').attr('src')
        console.log(url)
        $.post('/gifs', {url: url} )
        .done(function(response) {
          console.log(response)
        })
      }

      var getSavedGifs = function() {
        $.get('/gifs')
        .done(function(response) {
          var $container = $('.all-gifs-container');
          $container.html('')
          response.gifs.forEach(function(el) {
            var $div = $('<div>');
            var $img = $('<img>').attr('src', el.url);

            $container.append($div.append($img))

          })
        })
      }

    }

    //************************
    //AUTHENTICATION CONTROLLER
    //************************

    function AuthController($http, $state, $scope) {
      var self = this;

      function signup(userPass) {
        console.log(userPass)
        $http
          .post('/users', userPass)
          .then(function(response) {
            $state.go('login')
          });
      };

      function login(userPass) {
        $http
          .post('/sessions/login', userPass)
          .then(function(response) {
            $scope.$emit('userLoggedIn', response.data.data);

            $state.go('index', {reload: true});
        });
      };

      function logout() {
        $http.delete('/sessions')
          .then(function(response) {
            $scope.$emit('userLoggedOut')
          });
      };

      this.signup = signup;
      this.login = login;
      this.logout = logout;
    }
