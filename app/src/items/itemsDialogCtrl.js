(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsDialogCtrl', ItemsDialogCtrl);

    ItemsDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'ItemsService', 'ItemsLocalStorage', '$stateParams'];

    function ItemsDialogCtrl($state, $rootScope, $timeout, ItemsService, ItemsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            itemsDelete: itemsDelete,
            itemsEditBack: itemsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
            $rootScope.loading = false;
        });

        function itemsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

			ItemsLocalStorage.deleteItem(vm.id);
			$rootScope.loading = true;
			$timeout(function () {
				if (vm.type == 'movie') {
					$state.go('items');
				} else {
					$state.go('series');
				}
			}, 100);
        }
		
        function itemsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
				if (vm.type == 'movie') {
					$state.go('items');
				} else {
					$state.go('series');
				}
            }, 100);
        }
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();