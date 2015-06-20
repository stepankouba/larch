/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */

export default function rdLoading() {
    let directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};