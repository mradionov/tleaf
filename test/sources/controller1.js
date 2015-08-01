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
    .directive('MyDir1', function (MyService1) {

    });

}());