/**
 * Master Controller
 */
'use strict';

let MasterCtrl = function ($scope, $cookieStore, $routeParams, $log, DashSrvc) {

    $scope.isOpen = true;
    $scope.dashboards = null;

    this.init = function init() {
        /**
         * Sidebar Toggle & Cookie Control
         */
        let mobileView = 992;

        $scope.getWidth = function() {
            return window.innerWidth;
        };

        $scope.$watch($scope.getWidth, function(newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookieStore.get('toggle'))) {
                    $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }

        });

        $scope.toggleSidebar = function() {
            $scope.toggle = !$scope.toggle;
            $cookieStore.put('toggle', $scope.toggle);
        };

        window.onresize = function() {
            $scope.$apply();
        };
    };

    this.getDashboards = function (){
        $scope.dashboardId = $routeParams.dashId;

        DashSrvc.getAll(1)
            .then(data => {
                $scope.dashboards = data;
                ;
            });
    };

    // init
    this.init();
    this.getDashboards();
};
MasterCtrl.$inject = ['$scope', '$cookieStore', '$routeParams', '$log', 'DashSrvc'];

export default MasterCtrl;