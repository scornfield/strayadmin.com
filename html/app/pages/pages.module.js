/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('StrayAdmin.pages', [
    'ui.router',
    'StrayAdmin.pages.home',
    'StrayAdmin.pages.players',
    'StrayAdmin.pages.teams'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/home');

    baSidebarServiceProvider.addStaticItem({
      title: 'Sign Out',
      fixedHref: 'logout.html',
    });
  }

})();
