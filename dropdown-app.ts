import {
 DropdownController
} from './dropdown-controller';

import {
 DropdownDirective
} from './dropdown-directive';

import {
 DropdownConverter
} from './dropdown-converter';

let materialConverterApp = angular.module('material-dropdown-converter', [])
  .controller('maeterial-DropdownController', DropdownController)
  .directive('materialDropdown', ['$parse', DropdownDirective])
  .directive('select', ['$compile', DropdownConverter])
  .run(['$templateCache',($templateCache: ng.ITemplateCacheService) => {

  $templateCache.put('regularTemplate.html', '<md-select ng-disabled="vm.ngDisabled" ng-model="vm.model" ng-class=\'{"no-select":vm.showSingle}\'>\
     <md-select-label>{{vm.getDisplayValue()}}</md-select-label> \
      <md-option md-no-ink ng-repeat="item in vm.items track by $index" ng-value="item.value" ng-click="vm.selected(item)">{{item.text}}</md-option> \
    </md-select>');

  $templateCache.put('oneTimeTemplate.html', '<md-select ng-disabled="vm.ngDisabled" ng-model="vm.model" ng-class=\'{"no-select":vm.showSingle}\'>\
     <md-select-label>{{vm.getDisplayValue()}}</md-select-label> \
      <md-option md-no-ink ng-repeat="item in ::vm.items track by $index" ng-value="::item.value" ng-click="vm.selected(item)">{{::item.text}}</md-option> \
  </md-select>');

  $templateCache.put('noSelectionTemplate.html', '<md-select ng-model="vm.model" class="no-select">\
         <md-select-label>{{vm.getDisplayValue()}}</md-select-label> \
     <md-option md-no-ink ng-value="::vm.items[0].value">{{::vm.items[0].text}}</md-option></md-select>');

  $templateCache.put('groupTemplate.html', '<md-select ng-model="vm.model">\
     <md-select-label>{{vm.getDisplayValue()}}</md-select-label> \
          <md-optgroup ng-repeat = "group in vm.groups" ng-attr-label="{{group}}"> \
         <md-option md-no-ink ng-repeat="item in vm.items| filter: {group: group}" track by $index" ng-value="item.value" ng-click="vm.selected(item)">{{item.text}}</md-option></md-optgroup> \
      </md-select>');

  $templateCache.put('groupTemplatePerformant.html', '<md-select ng-model="vm.model">\
     <md-select-label>{{vm.getDisplayValue()}}</md-select-label> \
          <md-optgroup ng-repeat = "group in vm.groups" ng-attr-label="{{::group}}"> \
         <md-option md-no-ink ng-repeat="item in ::vm.items| filter: {group: group}" track by $index" ng-value="::item.value" ng-click="vm.selected(item)">{{::item.text}}</md-option></md-optgroup> \
      </md-select>');
}]);

export { materialConverterApp };
