(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsAddCtrl', ItemsAddCtrl);

    ItemsAddCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'ItemsService', 'ItemsLocalStorage',
        'categories', 'groups'];

    function ItemsAddCtrl($scope, $state, $rootScope, $timeout, ItemsService, ItemsLocalStorage,
                          categories, groups) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;
        var optionalCategory = {name: 'Select category'};
        var optionalGroup = {name: 'Select group'};

        angular.extend(vm, {
            init: init,
            updateChangeCategory: updateChangeCategory,
            updateChangeGroup: updateChangeGroup,
            convertPicToJSON: convertPicToJSON,
            itemsAddSubmit: itemsAddSubmit,
            _addItem: addItem,
            itemsAddBack: itemsAddBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.category = categories;
            vm.categoryOptions = [].concat(vm.category);
            vm.categoryOptions.unshift(optionalCategory);
            vm.categorySelectedItem = vm.categoryOptions[0];

            vm.group = groups;
            vm.groupOptions = [].concat(vm.group);
            vm.groupOptions.unshift(optionalGroup);
            vm.groupSelectedItem = vm.groupOptions[0];

            $rootScope.loading = false;
			vm.pic = $rootScope.noImage;
        }

        function updateChangeCategory(item) {
            vm.categoryError = false;
            vm.groupError = false;
            vm.categoryName = item.name;

            if (vm.categorySelectedItem.name == 'Select category') {
                vm.groupOptions = [].concat(vm.group);
                vm.groupOptions.unshift(optionalGroup);
                vm.groupSelectedItem = vm.groupOptions[0];
                return;
            }

            vm.groupOptions = [].concat(vm.group);
            vm.groupOptionsSorted = [];

            for (var i = 0; i < vm.groupOptions.length; i++) {
                if (vm.groupOptions[i].category == item.name) {
                    vm.groupOptionsSorted.push(vm.groupOptions[i]);
                }
            }

            vm.groupOptions = [].concat(vm.groupOptionsSorted);
            vm.groupSelectedItem = vm.groupOptions[0];

            if (vm.groupSelectedItem) {
                vm.groupName = vm.groupSelectedItem.name;
            }
        }

        function updateChangeGroup(item) {
            vm.groupError = false;
            vm.groupName = item.name;
        }

        function convertPicToJSON() {
            var fileInput = document.getElementById("picFileInput");
            var files = fileInput.files;
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function () {
                $scope.$apply(function () {
                    vm.pic = reader.result;
                });
            };
            reader.readAsDataURL(file);
        }

        function itemsAddSubmit() {
            if (vm.categorySelectedItem.name == 'Select category') {
                vm.categoryError = true;
                return;
            }

            if (vm.groupSelectedItem == undefined || vm.groupSelectedItem.name == 'Select group') {
                vm.groupError = true;
                return;
            }

            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                name: vm.name,
                pic: 'blank',
                category: vm.categoryName,
                group: vm.groupName,
                description: vm.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ItemsService.addItem(item)
                    .then(function () {
                        addItem(item);
                        $rootScope.myError = false;
                        $state.go('items');
                    })
                    .catch(errorHandler);
            } else {
				try {
					ItemsLocalStorage.addItem(item);
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

        function addItem(item) {
            ItemsService.items.push(item);
        }

        function itemsAddBack() {
			$rootScope.myError = false;
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