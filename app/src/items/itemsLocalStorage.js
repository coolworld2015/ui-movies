(function () {
    'use strict';

    angular
        .module('app')
        .factory('ItemsLocalStorage', ItemsLocalStorage);

    function ItemsLocalStorage() {
        return {
            items: [],
            numPerPage: 10,

            getItems: getItems,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            setItems: setItems,

            uploadItems: uploadItems,
            findByName: findByName,
            _sort: sort
        };

        function getItems() {
            if (ItemsLocalStorage.items === undefined) {
                var items = localStorage.getItem('ui-collection.items');
                items = JSON.parse(items);
                ItemsLocalStorage.items = items;
            }

            if (ItemsLocalStorage.items === null) {
                ItemsLocalStorage.items = [];
            }

            return ItemsLocalStorage.items.sort(sort);
        }

        function addItem(item) {
            ItemsLocalStorage.items.push(item);
            setItems();
        }

        function editItem(item) {
            var items = ItemsLocalStorage.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == item.id) {
                    items.splice(i, 1, item);
                    setItems();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var items = ItemsLocalStorage.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == id) {
                    items.splice(i, 1);
                    setItems();
                    break;
                }
            }
        }

        function setItems() {
            localStorage.setItem('ui-collection.items', JSON.stringify(ItemsLocalStorage.items));
        }

        function uploadItems(items) {
            localStorage.setItem('ui-collection.items', JSON.stringify(items));
            ItemsLocalStorage.items = undefined;
        }

        function findByName(name) {
            getItems();
            var items = ItemsLocalStorage.items;
            var results = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].name.toUpperCase().indexOf(name.toUpperCase()) > -1) {
                    results.push(items[i]);
                }
            }
            return results;
        }

        function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }
    }
})();
