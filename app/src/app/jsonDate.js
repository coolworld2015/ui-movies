(function () {
    'use strict';

    angular
        .module('app')
        .filter("jsonDate", jsonDate);

    function jsonDate() {
        return function (x) {
            return new Date(parseInt(x.substr(6)));
        };
    }
})();
