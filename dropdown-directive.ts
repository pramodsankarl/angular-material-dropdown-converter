export {
    DropdownController
} from './dropdown-controller';

export {
    IDropDownSettings,
    IDropDownAttributes,
    IDropDownViewModel
};

function DropdownDirective($parse: ng.IParseService):  ng.IDirective{
    //Regex taken from angular
    var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

    function getTemplateUrl(_, attr: IDropDownAttributes) {
        var settings = JSON.parse(attr.settings || "{}");

        if (settings.noSelection) {
            return 'noSelectionTemplate.html';
        }

        if (attr.options.match(NG_OPTIONS_REGEXP)[3]) {
            if (settings.performant) {
                return 'groupTemplatePerformant.html';
            }
            return 'groupTemplate.html';
        }

        if (settings.performant) {
            return 'oneTimeTemplate.html';
        }

        return 'regularTemplate.html';
    };

    function postLink(scope, elm: ng.IAugmentedJQuery, attrs: IDropDownAttributes, ctrl: ng.INgModelController) {
        var match = attrs.options.match(NG_OPTIONS_REGEXP);

        var
            displayFn = $parse(match[2] || match[1]),
            valueName = match[4] || match[6],
            selectAs = / as /.test(match[0]) && match[1],
            selectAsFn = selectAs ? $parse(selectAs) : null,
            keyName = match[5],
            groupByFn = $parse(match[3] || ''),
            valueFn = $parse(match[2] ? match[1] : valueName),
            valuesFn = $parse(match[7]),
            track = match[8],
            locals = {},
            trackField: string = _getNormalizedProp(track),
            groupField: string = _getNormalizedProp(match[3]),
            settings: IDropDownSettings = JSON.parse(attrs.settings || "{}"),
            unWatchCollection,
            dropdownCtrl: DropdownController = scope.vm;

        init();
        
        function init() {
            unWatchCollection = scope.$parent.$watchCollection(valuesFn, _setCollection);
            dropdownCtrl.groups = [];
            dropdownCtrl.ngModel = ctrl;
            ctrl.$render = render;
            scope.$destroy = () => {
                dropdownCtrl = null;
            };
        }
        
        function render() {
            if (!angular.isArray(dropdownCtrl.items) || !angular.isDefined(ctrl.$viewValue)) return;
            var viewValue = _getMatchedTrackValue(ctrl.$viewValue);

            for (var i = 0, l = dropdownCtrl.items.length; i < l; i++) {
                if (viewValue == _getMatchedTrackValue(dropdownCtrl.items[i].value)) {
                    return dropdownCtrl.selectedItem = dropdownCtrl.items[i];
                }
            }
        }
        
        function _getMatchedTrackValue(value: any): any {
            return trackField ? scope.$eval.call(value, trackField) : value;
        }

        function _getNormalizedProp(prop: string): string {
            if (!prop) return prop;
            return prop.split('.').slice(1).join('.');
        }

        function _setCollection(values: any[], oldVal, thisScope) {
            dropdownCtrl.groups = [];

            if (angular.isDefined(values) && settings.performant) {
                unWatchCollection();
            }

            if (values && angular.isArray(values)) {
                dropdownCtrl.items = values.map((it, i)=>{
                    var ret = {
                        text: _callExpression(thisScope, displayFn, i, it),
                        value: _callExpression(thisScope, selectAsFn || valueFn, i, it)
                    };
                    _setGroup(thisScope, i, it, ret);
                    return ret;
                });
            } else if (values) {
                // TODO: Implement for object if needed
            }

            if (settings.sglItemLabel && dropdownCtrl.items && dropdownCtrl.items.length === 1) {
                dropdownCtrl.showSingle = true;
            };

            ctrl.$render();
        }

        function _setGroup(thisScope, i, it, listItem) {
            var group;
            if (!groupField) return;
            group = _callExpression(thisScope, groupByFn, i, it) || " ";
            listItem.group = group;
            if (!~dropdownCtrl.groups.indexOf(group)) {
                dropdownCtrl.groups.push(group);
            }
        }

        function _callExpression(thisScope, exprFn, key, value) {
            locals[valueName] = value;
            if (keyName) locals[keyName] = key;
            return exprFn(thisScope, locals);
        }
    };

    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngChange: "&?",
            model: "=ngModel",
            ngDisabled: "=?",
            placeholder:"@?"
        },
        controller: DropdownController,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: getTemplateUrl,
        compile: function (tElm, attr) {
            let containerClass = attr['mdContainerClass'];
            if (containerClass) {
                tElm.find('md-select').attr('md-container-class', containerClass);
            }
            return postLink;
        }
    };
};

export {DropdownDirective};
