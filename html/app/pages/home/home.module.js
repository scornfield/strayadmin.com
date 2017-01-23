/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('StrayAdmin.pages.home', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'app/pages/home/home.html',
          controller: 'HomeCtrl',
          title: 'Home',
          sidebarMeta: {
            icon: 'ion-home',
            order: 100,
          },
        });
  }

})();