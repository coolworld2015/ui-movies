(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchResultsCtrl', SearchResultsCtrl);

    SearchResultsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'results', 'ItemsLocalStorage'];

    function SearchResultsCtrl($scope, $rootScope, $state, $timeout, results, ItemsLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
			openPic: openPic,
			convertFileToBase64viaFileReader: convertFileToBase64viaFileReader,
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
		
		function convertFileToBase64viaFileReader(url, callback){
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = function() {
				var reader  = new FileReader();
				reader.onloadend = function () {
					callback(reader.result);
				}
				reader.readAsDataURL(xhr.response);
			};
			xhr.open('GET', url);
			xhr.send();
		}

        function itemsSubmit() {
            if (!vm.response) {
                return goCancel();
            }
			
			$rootScope.loading = true;
            $rootScope.myError = false;
			
			convertFileToBase64viaFileReader(vm.pic, function(base64Img){
				vm.pic = base64Img;
				
				var id = (Math.random() * 1000000).toFixed();
				var item = {
					id: id,
					name: vm.title,
					pic: vm.pic,
					plot: vm.plot,
 					year: vm.year, 
 					genre: vm.genre,
					country: vm.country,
					actors: vm.actors,
					runtime: vm.runtime,
					type: vm.type,
					imdbID: vm.imdbID,
					imdbRating:vm.imdbRating
				};
 
				try {
					ItemsLocalStorage.getItems();
					ItemsLocalStorage.addItem(item);
					$rootScope.loading = true;
					$timeout(function () {
						if (vm.type == 'movie') {
							$state.go('items');
						} else {
							$state.go('series');
						}
					}, 100);
				} catch(e) {
					errorHandler();
					alert(e);
				}
			});
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