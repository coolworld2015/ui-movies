(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$state', '$rootScope', '$timeout'];

    function SearchCtrl($state, $rootScope, $timeout) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            searchSubmit: searchSubmit,
            searchBack: searchBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.options = [
                {name: 'Search by name'},
                {name: 'Search by category'},
                {name: 'Search by group'},
                {name: 'Search by description'}
            ];
            vm.selectedItem = vm.options[0];

            $rootScope.loading = false;
        }

        function updateChange(item) {
            vm.error = false;
            vm.search = item.name;
        }

        function searchSubmit() {
            if (vm.form.$invalid) {
                return;
            }
            $rootScope.loading = true;
            $rootScope.error = false;
            $state.go('search-results', {name: vm.name, search: vm.search, finds: true});
        }

        function searchBack() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();