export {ListItem} from './dropdown.d';

class DropdownController {
    ngModel: ng.INgModelController;
    selectedItem: ListItem;
    ngChange: Function;
    groups: string[];
    items: ListItem[];
    showSingle: boolean = false;
    placeholder: string;

    static $inject = [];

    constructor() {
    }

    selected(itm: ListItem) {
        this.ngModel.$setViewValue(itm.value);
        this.ngModel.$render();
        this.selectedItem = itm;
    }

    getDisplayValue() {
        if (this.selectedItem && angular.isDefined(this.selectedItem.text)) {
            return this.selectedItem.text;
        }

        return this.placeholder;
    }
}

export {DropdownController};
