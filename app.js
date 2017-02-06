(function(){
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .directive('foundItems', FoundItems);

  function FoundItems(){
    var ddo = {
      templateUrl: "menuList.html",
      scope:{
        found:"<",
        onRemove: '&'

      },
      controller: MenuListDirectiveController,
      controllerAs: 'list',
      bindToController: true

    };
    return ddo;
  }

  function MenuListDirectiveController() {
    var list = this;
  }

  NarrowItDownController.$inject =['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
      var ctrl = this;
      ctrl.found = [];
      ctrl.searchTerm="";

      ctrl.removeItem = function(itemIndex){
         ctrl.found.splice(itemIndex,1);
      };

      ctrl.getMatchedMenuItems = function(){

        if(ctrl.searchTerm.length==0){
          ctrl.found=[];
        }else {
          var promise  =  MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
          promise.then(function(result){
            ctrl.found = result;
          });
        }

      };
  }

MenuSearchService.$inject =['$http'];
  function MenuSearchService($http){
    var service = this;

    service.getMatchedMenuItems = function(searchTerm){

      return $http({
          url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
      }).then(function(response){
          var foundItems = [];
          angular.forEach(response.data.menu_items, function(value, key){
            if(value.description.indexOf(searchTerm)!==-1){
              foundItems.push(value);
            }
          });
          return foundItems;
      });

    }
  }


})();
