'use strict';

/**
 * Route configuration for the RDash module.
 */
function router($routeProvider, $locationProvider) {

    $routeProvider
        .when('/dashboard/:dashId', {
            templateUrl: 'templates/dashboard.html',
            controller: 'MasterCtrl'
        })
        .when('/login', {
            templateUrl: 'templates/login.html'
        })
        .otherwise({ redirectTo: '/dashboard/1' });
}

router.$inject = ['$routeProvider', '$locationProvider'];

export default router;
