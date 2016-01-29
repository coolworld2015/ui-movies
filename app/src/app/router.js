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
                url: '/search-results?name?search?finds',
                templateUrl: 'search/search-results.html',
                controller: 'SearchResultsCtrl',
                controllerAs: 'searchResultsCtrl',
                resolve: {
                    results: ['$http', '$stateParams', '$rootScope', 'ItemsLocalStorage',
                        function ($http, $stateParams, $rootScope, ItemsLocalStorage) {
                            var name = $stateParams.name;
                            if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                                return ItemsLocalStorage.findByName(name);
                            } else {
                                var api = 'api/items/findByName/';
                                //var webUrl = $rootScope.myConfig.webUrl + api;

                                var webUrl = 'http://www.omdbapi.com/?t=';
                                return $http.get(webUrl + name)
                                    .then(function (data) {
                                        return data.data;
                                    })
                                    .catch(function () {
                                        $rootScope.loading = false;
                                        $rootScope.error = true;
                                        return [];
                                    });
                            }
                        }]
                }
            });
//-------------------------------------------------------------------------------------------------------

    }
})();