import { Injectable } from '@angular/core';
import { TreeviewSelection } from './treeview-item';

@Injectable()
export abstract class TreeviewI18n<T> {
  abstract getText(selection: TreeviewSelection<T>): string;
  abstract getAllCheckboxText(): string;
  abstract getFilterPlaceholder(): string;
  abstract getFilterNoItemsFoundText(): string;
  abstract getTooltipCollapseExpandText(isCollapse: boolean): string;
}

@Injectable()
export class DefaultTreeviewI18n<T> extends TreeviewI18n<T> {
  getText(selection: TreeviewSelection<T>): string {
    if (selection.uncheckedItems.length === 0) {
      if (selection.checkedItems.length > 0) {
        return this.getAllCheckboxText();
      } else {
        return '';
      }
    }

    switch (selection.checkedItems.length) {
      case 0:
        return 'Select options';
      case 1:
        return selection.checkedItems[0].text;
      default:
        return `${selection.checkedItems.length} options selected`;
    }
  }

  getAllCheckboxText(): string {
    return 'All';
  }

  getFilterPlaceholder(): string {
    return 'Filter';
  }

  getFilterNoItemsFoundText(): string {
    return 'No items found';
  }

  getTooltipCollapseExpandText(isCollapse: boolean): string {
    return isCollapse ? 'Expand' : 'Collapse';
  }
}
