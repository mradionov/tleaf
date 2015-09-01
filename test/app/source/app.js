(function () {

  angular
    .module('app', [])
    .controller('MyCtrl', function ($scope, $http, MyService) {
      $scope.foo = 'bar';
    })
    .service('MyService', function ($http, MyService) {
      this.foo = 'bar';
    })
    .factory('MyFactory', function ($http, MyService) {
      return {
        foo: 'bar'
      };
    })
    .directive('myDir', function ($http, MyService) {
      return {
        foo: 'bar'
      };
    })
    .provider('MyProvider', function () {
      this.$get = function () {};
    })
    .filter('MyFilter', function () {
      return function () {};
    })
    .value('MyValue', 42)
    .constant('MyConstant', 42);

}());