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
                    results: ['$http', '$q', '$stateParams', '$rootScope',
                        function ($http, $q, $stateParams, $rootScope) {
                            var name = $stateParams.name;
                            var search = $stateParams.search;
                            var webUrl;
                            if (search == 'Search by title') {
                                webUrl = 'http://www.omdbapi.com/?t=';
                            } else {
                                webUrl = 'http://www.omdbapi.com/?i=';
                            }
                            return $http.get(webUrl + name + '&plot=full')
                                .then(function (data) {
                                    return data.data;
                                })
                                .catch(function (reject) {
                                    $rootScope.loading = false;
                                    $rootScope.myError = true;
                                    return $q.reject(reject);
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
                        }],
                    status: function () {
                        return 'movie';
                    },
                    wifi: ['$http', '$q', '$stateParams', '$rootScope',
                        function ($http, $q, $stateParams, $rootScope) {
                            var webUrl = 'http://ia.media-imdb.com/images/' +
                                'M/MV5BMjEyNjEyMDE5NV5BMl5BanBnXkFtZTcwNzQzNzIzMQ@@._V1._CR31,2,313,472_SX89_AL_.jpg_V1_SX300.jpg';
                            return $http.get(webUrl)
                                .then(function (data) {
                                    return true;
                                })
                                .catch(function (reject) {
                                    $rootScope.loading = false;
                                    $rootScope.myError = true;
                                    return false;
                                });
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
                        }],
                    status: function () {
                        return 'series';
                    },
                    wifi: ['$http', '$q', '$stateParams', '$rootScope',
                        function ($http, $q, $stateParams, $rootScope) {
                            var webUrl = 'http://ia.media-imdb.com/images/' +
                                'M/MV5BMjEyNjEyMDE5NV5BMl5BanBnXkFtZTcwNzQzNzIzMQ@@._V1._CR31,2,313,472_SX89_AL_.jpg_V1_SX300.jpg';
                            return $http.get(webUrl)
                                .then(function () {
                                    return true;
                                })
                                .catch(function () {
                                    $rootScope.loading = false;
                                    $rootScope.myError = true;
                                    return false;
                                });
                        }]
                }
            });
//-------------------------------------------------------------------------------------------------------
    }
})();