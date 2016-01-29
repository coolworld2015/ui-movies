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
            _deleteItem: deleteItem,
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

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ItemsService.deleteItem(vm.id)
                    .then(function () {
                        deleteItem(vm.id);
                        $rootScope.myError = false;
                        $state.go('items');
                    })
                    .catch(errorHandler);
            } else {
                ItemsLocalStorage.deleteItem(vm.id);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('items');
                }, 100);
            }
        }

        function deleteItem(id) {
            var items = ItemsService.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == id) {
                    items.splice(i, 1);
                    break;
                }
            }
        }

        function itemsEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('items');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();