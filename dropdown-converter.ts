
function DropdownConverter($compile) {
   let _parentSelector = ".convertselect",
       rawTemplate = '<material-dropdown placeholder="--Select--" settings=\'{"performant":true}\'></material-dropdown>',
       attrAlias = {
           'ng-options': 'options',
           'data-ng-options' : 'options'
       };

   return {
       restrict: 'E',
       link: function (scope:ng.IScope, elm:ng.IAugmentedJQuery ,attr:ng.IAttributes) {
           let $materialDropdown = angular.element(rawTemplate),
               options = attr['ngOptions'];

           if (!elm.closest(_parentSelector).length || !options) return;
         
           //Copy attributes
           angular.forEach(elm[0].attributes, (attrObj) => {
               let attr = attrAlias[attrObj.name] || attrObj.name;
               $materialDropdown.attr(attr, elm.attr(attrObj.name));
           });
           elm.replaceWith($materialDropdown);
           $compile($materialDropdown)(scope);
       }
   }
};

export { DropdownConverter };
