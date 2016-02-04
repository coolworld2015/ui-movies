(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsCtrl', ItemsCtrl);

    ItemsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'items', 'status', 'wifi'];

    function ItemsCtrl($scope, $rootScope, $state, $timeout, items, status, wifi) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
			_sortData: sortData,
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
            vm.wifi = wifi;
            vm.blank = $rootScope.noWIFI;

			sortData();
			if (status == 'movie') {
				vm.title = 'Movies';	
				vm.items = vm.movies;				
			} else {
				vm.title = 'Series';
				vm.items = vm.series;
			}
            
            vm.itemsFilter = [];
            $scope.currentPage = 1;
            $scope.numPerPage = $rootScope.numPerPageItems;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
        }
		
		function sortData() {
			vm.movies = [];
			vm.series = [];
			for (var i = 0; i < items.length; i++) {
				if (items[i].type == 'movie') {
					vm.movies.push(items[i]);	
				} else {
					vm.series.push(items[i]);	
				}
			}
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
            if (vm.wifi == false) {
                item.pic = vm.blank;
            }
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