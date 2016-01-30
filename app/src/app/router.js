(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');

        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'app/main.html',
                controller: 'MainCtrl',
                controllerAs: 'mainCtrl'
            })
//-------------------------------------------------------------------------------------------------------
            .state('movies', {
                url: '/movies',
                templateUrl: 'movies/movies.html',
                controller: 'MoviesCtrl',
                controllerAs: 'moviesCtrl'
            })
//-------------------------------------------------------------------------------------------------------
            .state('search', {
                url: '/search',
                templateUrl: 'search/search.html',
                controller: 'SearchCtrl',
                controllerAs: 'searchCtrl'
            })
//-------------------------------------------------------------------------------------------------------
            .state('search-results', {
                url: '/search-results?name?search',
                templateUrl: 'search/search-results.html',
                controller: 'SearchResultsCtrl',
                controllerAs: 'searchResultsCtrl',
                resolve: {
                    results: ['$http', '$stateParams', '$rootScope', 
                        function ($http, $stateParams, $rootScope) {
                            var name = $stateParams.name;
                            var search = $stateParams.search;
                            if (search == 'Search by title') {
								var webUrl = 'http://www.omdbapi.com/?t=';
                            } else {
                                var webUrl = 'http://www.omdbapi.com/?i=';
							}
							return $http.get(webUrl + name + '&plot=full')
								.then(function (data) {
									return data.data;
								})
								.catch(function () {
									$rootScope.loading = false;
									$rootScope.error = true;
									return [];
								});
                        }]
                }
            })
//-------------------------------------------------------------------------------------------------------
            .state('items', {
                url: '/items',
                templateUrl: 'items/items.html',
                controller: 'ItemsCtrl',
                controllerAs: 'itemsCtrl',
                resolve: {
                    items: ['ItemsLocalStorage',
                        function (ItemsLocalStorage) {
                                return ItemsLocalStorage.getItems();
                         }]
                }
            })
//-------------------------------------------------------------------------------------------------------				
           .state('items-edit', {
                url: '/items-edit?finds',
                params: {item: {}},
                templateUrl: 'items/items-edit.html',
                controller: 'ItemsEditCtrl',
                controllerAs: 'itemsEditCtrl'
            })
//-------------------------------------------------------------------------------------------------------	
            .state('items-dialog', {
                url: '/items-dialog',
                params: {item: {}},
                templateUrl: 'items/items-dialog.html',
                controller: 'ItemsDialogCtrl',
                controllerAs: 'itemsDialogCtrl'
            })
//-------------------------------------------------------------------------------------------------------
            .state('series', {
                url: '/series',
                templateUrl: 'items/items.html',
                controller: 'ItemsCtrl',
                controllerAs: 'itemsCtrl',
                resolve: {
                    items: ['ItemsLocalStorage',
                        function (ItemsLocalStorage) {
                                return ItemsLocalStorage.getItems();
                         }]
                }
            })			
//-------------------------------------------------------------------------------------------------------
    }
})();