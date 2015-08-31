(function () {

  angular
    .module('app', [])
    .controller('MyCtrl', function ($http, MyService) {

    })
    .service('MyService', function ($http, MyService) {

    })
    .factory('MyFactory', function ($http, MyService) {

    })
    .directive('myDir', function ($http, MyService) {

    })
    .provider('MyProvider', function () {
        this.$get = function ($http, MyService) {};
    })
    .filter('MyFilter', function () {

    })
    .value('MyValue', 42)
    .constant('MyConstant', 42);

}());