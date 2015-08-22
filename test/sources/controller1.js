(function () {

  angular
    .module('app', [])
    .controller('FirstCtrl', function ($scope, $state, MyService1, MyService2) {

      // ....

    })
    .controller('SecondCtrl', function () {

    })
    .service('MyService1', function ($http, MyService2) {

    })
    .factory('MyFactory1', function ($http, MyService1) {

    })
    .directive('MyDir1', function (MyService1) {

    })
    .provider('MyProvider', function () {
        this.$get = function (MyService1) {};
    })
    .constant('MyConstant', 42);

}());