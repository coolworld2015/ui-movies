(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsEditCtrl', ItemsEditCtrl);

    ItemsEditCtrl.$inject = ['$state', '$rootScope', '$timeout', '$stateParams'];

    function ItemsEditCtrl($state, $rootScope, $timeout, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            openPic: openPic,
            itemsDialog: itemsDialog,
            itemsEditBack: itemsEditBack,
            goCancel: goCancel,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            if ($stateParams.item.name == undefined) {
                $state.go('main');
            }

            if ($stateParams.item.pic == 'blank') {
                vm.pic = $rootScope.noImage;
            }
            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function openPic() {
            $rootScope.loading = true;

            $timeout(function () {
                window.open(vm.pic);
            }, 100);

            $timeout(function () {
                $rootScope.loading = false;
            }, 3000);
        }

        function itemsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name,
                type: vm.type
            };
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('items-dialog', {item: obj});
            }, 100);
        }

        function itemsEditBack() {
            $rootScope.myError = false;
            $rootScope.loading = true;
            $timeout(function () {
                if ($stateParams.finds) {
                    $state.go('search');
                } else {
                    if ($stateParams.item.type == 'movie') {
                        $state.go('items');
                    } else {
                        $state.go('series');
                    }
                }
            }, 100);
        }

        function goCancel() {
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