angular.module('listAngularApp')
  .controller('HomeController', HomeController)
  .controller('AuthController', AuthController)
  .controller('ListController', ListController)

  function HomeController($scope, $http) {
    var self = this;

    $scope.$on('userLoggedIn', function(event, data){
      self.currentUser = data;
    });

    $scope.$on('userLoggedOut', function(event, data) {
      self.currentUser = null;
    });
  }

  function AuthController($http, $state, $scope, $rootScope) {
    var self = this;
    var allUsers = allUsers;

    function signup(userPass) {
      $http.post('/users', userPass)
        .then(function(response) {
          $state.go('login');
        });
    }

    function login(userPass) {
      $http.post('/sessions/login', userPass)
        .then(function(response) {
          $scope.$emit('userLoggedIn', response.data.data);
          $rootScope.$emit('fetchData', response.data.data);
          getAllUsers();
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

    this.signup = signup;
    this.login = login;
    this.logout = logout;
  }

  function ListController($scope, $http, $state, $stateParams, $rootScope) {
      var list = this;
      list.saveList = saveList;
      // list.getSavedLists = getSavedLists;
      list.showUser = showUser;
      list.showEditForm = showEditForm;
      list.updateList = updateList;
      list.userList = [];

      function showUser(userId){

        $http
        .get('/users/' + userId)
        .then(function(response){
          console.log(response);
          console.log(response.data.user.list);
          if(response.data.status === 401){return}
          list.userList = response.data.user.list;
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
          list.userList = response.data.user.list;
        });
      }

      //show the edit form
      function showEditForm(list, currentUser) {
        console.log("clicky poo");
        self.name = list.name;

        $state.go('updateList', {
          userId: currentUser._id,
          listId: list._id
        });
       }

       //edit the list item
       function updateList(currentUser) {
         $http.put(`/users/${currentUser._id}/lists/${$stateParams.listId}`, { name: list.name} )
           .then(function(Response) {
             self.savedLists = Response.data.currentUser.lists;

             self.url = '';
             self.name = '';

             $state.go('savedLists', { userId: currentUser._id })
           })
       }

      // $rootScope.$on('fetchData', function(event, data) {
      //   populateInitialState(data)
      // });

      // function populateInitialState(data) {
      //   $http.get(`users/${currentUser._id}/lists`)
      //     .then(function(response) {
      //       self.savedLists = response.data.lists
      //     })
      // }
      //
      // function getSavedLists(currentUser) {
      //   $http.get(`users/${currentUser._id}/lists`)
      //     .then(function(response) {
      //       self.savedLists = response.data.lists
      //
      //       $state.go('savedLists', {userId: currentUser._id})
      //     })
      // }

      // function saveList(url, currentUser) {
      //   console.log(currentUser)
      //   $http.post(`/users/${currentUser._id}/lists`, { url: url, name: self.name } )
      //     .then(function(serverResponse) {
      //       self.savedLists.push(serverResponse.data.list);
      //       self.name = '';
      //       .listUrl = '';
      //
      //       $state.go('savedLists', { userId: currentUser._id })
      //     })
      // }
      //
      // function populateFormData(list, currentUser) {
      //   self.url = list.url
      //   self.name = list.name
      //
      //   $state.go('updateList', {
      //     userId: currentUser._id,
      //     listId: list._id
      //   })
      //  }
      //


      //
      // function deleteList(id, currentUser) {
      //   console.log(id)
      //   $http.delete(`users/${currentUser._id}/lists/${id}`)
      //     .then(function(response) {
      //       self.savedLists = response.data.currentUser.lists
      //     })
      // }
      //
      // this.getList = getList;
      // this.saveList = saveList;
      // this.updateList = updateList;
      // this.populateFormData = populateFormData;
      // this.getSavedLists = getSavedLists;
      // this.deleteList = deleteList;
    };
