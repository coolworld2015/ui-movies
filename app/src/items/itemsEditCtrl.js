(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsEditCtrl', ItemsEditCtrl);

    ItemsEditCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'ItemsService', 'ItemsLocalStorage', '$stateParams'];

    function ItemsEditCtrl($scope, $state, $rootScope, $timeout, ItemsService, ItemsLocalStorage, $stateParams) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;

        angular.extend(vm, {
            init: init,
            convertPicToJSON: convertPicToJSON,
            openPic: openPic,
            itemsSubmit: itemsSubmit,
            _editItem: editItem,
            itemsDialog: itemsDialog,
            itemsEditBack: itemsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
			if ($stateParams.item.pic == 'blank') {
				vm.pic = $rootScope.noImage;
			}
            $rootScope.myError = false;
            $rootScope.loading = false;
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
            if (vm.form.$invalid) {
                return;
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

        function editItem(item) {
            var items = ItemsService.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == item.id) {
                    items.splice(i, 1, item);
                    break;
                }
            }
        }

        function itemsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
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
                    $state.go('items');
                }
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();