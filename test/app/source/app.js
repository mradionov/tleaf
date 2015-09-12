(function () {

  angular.module('app', [])

  .controller('MyCtrl', function ($scope, $http, MyService) {
    $scope.foo = 'bar';
    $scope.baz = function () {
      return 'qux';
    };
  })

  .service('MyService', function ($http, MyFactory) {
    this.foo = 'bar';
    this.baz = function () {
      return 'qux';
    };
  })

  .factory('MyFactory', function ($http, MyService) {
    return {
      foo: 'bar',
      baz: function () {
        return 'qux';
      }
    };
  })

  .provider('MyProv', function () {
    this.baz = function () {
      return 'qux';
    };
    this.$get = function () {
      return {
        foo: 'bar'
      };
    };
  })

  .directive('myDir', function ($http, MyService) {
    return {
      foo: 'bar',
      baz: function () {
        return 'qux';
      }
    };
  })

  .filter('MyFilter', function () {
    return function () {
      return 'baz';
    };
  })

  .value('MyValue', {
    foo: 'bar'
  })

  .constant('MyConstant', 42);

}());