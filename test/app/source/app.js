(function () {

  angular.module('app', [])

  .controller('MyCtrl', function ($scope, $http, MyService) {
    $scope.foo = 'bar';
    $scope.baz = function () {
      return 'qux';
    };
  })

  .service('MyService', function ($http) {
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
    var bar = 'qux';
    this.set = function (value) {
      bar = value;
    };
    this.$get = function ($http, MyService) {
      return {
        foo: function () {
          return bar;
        }
      };
    };
  })

  .directive('myDir', function ($http, MyService) {
    return {
      template: 'this is the myDir directive',
      foo: 'bar',
      baz: function () {
        return 'qux';
      }
    };
  })

  .component('myComp', {
    controller: function ($http, MyService) {
      var ctrl = this;

      ctrl.foo = 'bar';
      ctrl.baz = function () {
        return 'qux';
      };
    }
  })

  .filter('MyFilter', function () {
    return function (value) {
      return 'MyFilter filter: ' + value;
    };
  })

  .value('MyValue', 42)

  .constant('MyConstant', 42);

}());