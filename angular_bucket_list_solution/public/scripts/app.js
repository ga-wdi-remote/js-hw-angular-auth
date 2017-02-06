angular.module('giphyAngularApp')
  .controller('HomeController', HomeController)
  .controller('AuthController', AuthController)
  .controller('ListController', ListController);


  //***********************
  // AUTH controller
  //***********************
  function HomeController($scope, $http) {
    var self = this;
    console.log('hitting home controlla')

    $scope.$on('userLoggedIn', function(event, data){
      self.currentUser = data;
    });

    $scope.$on('userLoggedOut', function(event, data) {
      self.currentUser = null;
    });
  }

  //***********************
  // AUTH controller
  //***********************
  function AuthController($http, $state, $scope) {
    var self = this;
    self.signup = signup;
    self.login = login;
    self.logout = logout;
    self.getAllUsers = getAllUsers;
    self.allUsers = [];

    function signup(userPass) {
      console.log(userPass);
      $http
        .post('/users', userPass)
        .then(function(response) {
          $state.go('login');
        });
    }

    function login(userPass) {

      getAllUsers();

      $http
        .post('/sessions/login', userPass)
        .then(function(response) {
          $scope.$emit('userLoggedIn', response.data.data);
          $state.go('index', {reload: true});
      });
    }

    function logout() {
      $http.delete('/sessions')
        .then(function(response) {
          $scope.$emit('userLoggedOut');
            $state.go('index', {reload: true});
        });
    }

    function getAllUsers(){
      $http
      .get('/users')
      .then(function(response){
        console.log(response);
        console.log(response.data.users);
        self.allUsers = response.data.users
      });
    }

    getAllUsers();
  }


  //***********************
  // GIPHY controller
  //***********************
  function ListController($http, $state, $scope, $stateParams) {
    var list = this;
    // list.getList = getList;
    list.saveList = saveList;
    list.getSavedLists = getSavedLists;
    // list.deleteList = deleteList;
    // list.showEditForm = showEditForm;
    // list.updateList = updateList;
    // list.randomList = "";
    // list.allSavedLists = [];
    list.showUser = showUser;

    function showUser(userId){

      $http
      .get('/users/' + userId)
      .then(function(response){
        console.log(response);
        console.log(response.data.status);
        if(response.data.status === 401){return}
        $state.go('user', {userId: userId});
      });
    }

    //save list to database
    function saveList(id){
      console.log(id);
      console.log("New list: ", list.newList);
      $http
      .post('/users/' + id + '/lists', {name: list.newList})
      .then(function(response){
        console.log(response);
      });
    }

    //save gif to database for logged in user
    // function saveList(url, user) {
    //   console.log(url, user);
    //   $http.post('/users/' + user._id + '/gifs', {url: url} )
    //   .then(function(response) {
    //     console.log(response);
    //     list.randomList = "";
    //     list.allSavedLists = response.data.user.gifs;
    //   });
    // }

    //retrieve all saved gifs
    function getSavedLists(){
      console.log("CLICKY POO");
      $http
      .get('/users')
      .then(function(response) {
        console.log(response.data.currentUser.gifs);
        list.randomList = "";
        list.allSavedLists = response.data.currentUser.gifs;
      });
  }
  //
  // //render edit form, change state to edit form
  // function showEditForm(gif) {
  //   self.url = gif.url;
  //   self.name = gif.name;
  //
  //   $state.go('updateList', { gifId: gif._id });
  //  }
  //
  // //edit the gif
  // function updateList(user){
  //   console.log("Edit clicked");
  //   console.log(user);
  //   $http.put(`/users/${user._id}/gifs/${$stateParams.gifId}`, {url: list.url } )
  //   .then(function(response) {
  //     console.log(response);
  //       list.allSavedLists = response.data.user.gifs;
  //     $state.go('gifMainPage');
  //   });
  // }
  //
  // //edit the gif
  // function deleteList(gifID, user){
  //   console.log("delete ya", gifID, user);
  //   $http
  //   .delete('/users/' + user._id + '/gifs/' + gifID)
  //   .then(function(response) {
  //     console.log("******DELETE******");
  //     console.log(response);
  //     list.allSavedLists = response.data.user.gifs;
  //   });
  // }
}
