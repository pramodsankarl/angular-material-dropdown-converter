  interface IDropDownViewModel extends ng.IScope{
       vm: DropdownController;
    }

   interface IDropDownAttributes extends ng.IAttributes {
        options: any;
        settings: any
   }

   interface IDropDownSettings {
       performant: boolean;
       sglItemLabel: boolean;
   }

   interface ListItem {
       text: string;
       value: any;
   }

export {
  IDropDownViewModel,
  IDropDownAttributes,
  IDropDownSettings,
  ListItem
};
