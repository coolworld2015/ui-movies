(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchResultsCtrl', SearchResultsCtrl);

    SearchResultsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'results', '$stateParams'];

    function SearchResultsCtrl($scope, $rootScope, $state, $timeout, results, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
			openPic: openPic,
            itemsSubmit: itemsSubmit,
            goToBack: goToBack,
            goBack: goBack,
			goCancel: goCancel,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = results.Title;
            vm.error = results.Error;
			
            vm.response = results.Response;
			if (vm.response == 'False') {
                vm.response = false;
            }
			
            vm.plot = results.Plot;
            vm.year = results.Year;
            vm.pic = results.Poster;
            vm.genre = results.Genre;
            vm.country = results.Country;
            vm.actors = results.Actors;
            vm.runtime = results.Runtime;
            vm.type = results.Type;
            vm.imdbID = results.imdbID;
            vm.imdbRating = results.imdbRating;
			
            if (vm.pic == 'N/A') {
                vm.pic = false;
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
		
        function itemsSubmit() {
            if (!vm.response) {
                return goCancel();
            }

            $rootScope.loading = true;
            $rootScope.myError = false;

            var item = {
                id: vm.id,
                name: vm.name,
                pic: vm.pic,
                category: vm.category,
                group: vm.group,
                description: vm.description
            };
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ItemsService.editItem(item)
                    .then(function () {
                        editItem(item);
                        $rootScope.myError = false;
                        $state.go('items');
                    })
                    .catch(errorHandler);
            } else {
				try {
					ItemsLocalStorage.editItem(item);
					$rootScope.loading = true;
					$timeout(function () {
						$state.go('items');
					}, 100);
				} catch(e) {
					errorHandler();
					alert(e);
				}
            }
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('search');
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