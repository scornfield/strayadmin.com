/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('StrayAdmin.pages.teams', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('teams', {
          url: '/teams',
          templateUrl: 'app/pages/teams/teams.html',
          controller: 'TeamsCtrl',
          title: 'Teams',
          sidebarMeta: {
            icon: 'fa fa-users',
            order: 300,
          },
        });
  }

})();