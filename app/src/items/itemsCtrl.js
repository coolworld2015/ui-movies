(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsCtrl', ItemsCtrl);

    ItemsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'items'];

    function ItemsCtrl($scope, $rootScope, $state, $timeout, items) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
			updateChange: updateChange,
            currentPage: currentPage,
            itemsEditForm: itemsEditForm,
            itemsAdd: itemsAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            itemsBack: itemsBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Items';
            vm.items = items;
            vm.itemsFilter = [];
			vm.blank = $rootScope.noImage;
			
            $scope.currentPage = 1;
            $scope.numPerPage = $rootScope.numPerPageItems;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function updateChange() {
            $rootScope.numPerPageItems = $scope.numPerPage;
        }
		
        function currentPage() {
            if (Object.prototype.toString.call(vm.items) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredItems = vm.items.slice(begin, end);
                $scope.totalItems = vm.items.length;
            }
        }

        function itemsEditForm(item) {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('items-edit', {item: item});
            }, 100);
        }

        function itemsAdd() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('items-add');
            }, 100);
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function itemsBack() {
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