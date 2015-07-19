describe('Controller: FirstCtrl', function () { 'use strict';

  var scope, FirstCtrl, $state, MyService1, MyService2;

  beforeEach(function () {

    module('app');

    module(function ($provide) {
      $provide.value('$state', {});
      $provide.value('MyService1', {});
      $provide.value('MyService2', {});
    });

    inject(function ($controller, _$state_, _MyService1_, _MyService2_) {
      scope = {};

      $state = _$state_;
      MyService1 = _MyService1_;
      MyService2 = _MyService2_;
      

      FirstCtrl = $controller('FirstCtrl', {
        $scope: scope
      });
    });

  });

});