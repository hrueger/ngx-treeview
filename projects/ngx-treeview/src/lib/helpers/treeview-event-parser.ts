import { Injectable } from '@angular/core';
import { isNil } from 'lodash';
import { TreeviewItem } from '../models/treeview-item';
import { TreeviewComponent } from '../components/treeview/treeview.component';

@Injectable()
export abstract class TreeviewEventParser<T> {
  abstract getSelectedChange(component: TreeviewComponent<T>): any[];
}

@Injectable()
export class DefaultTreeviewEventParser<T> extends TreeviewEventParser<T> {
  getSelectedChange(component: TreeviewComponent<T>): any[] {
    const checkedItems = component.selection.checkedItems;
    if (!isNil(checkedItems)) {
      return checkedItems.map(item => item.value);
    }

    return [];
  }
}

export interface DownlineTreeviewItem<T> {
  item: TreeviewItem<T>;
  parent: DownlineTreeviewItem<T>;
}

@Injectable()
export class DownlineTreeviewEventParser<T> extends TreeviewEventParser<T> {
  getSelectedChange(component: TreeviewComponent<T>): any[] {
    const items = component.items;
    if (!isNil(items)) {
      let result: DownlineTreeviewItem<T>[] = [];
      items.forEach(item => {
        const links = this.getLinks(item, null);
        if (!isNil(links)) {
          result = result.concat(links);
        }
      });

      return result;
    }

    return [];
  }

  private getLinks(item: TreeviewItem<T>, parent: DownlineTreeviewItem<T>): DownlineTreeviewItem<T>[] {
    if (!isNil(item.children)) {
      const link = {
        item,
        parent
      };
      let result: DownlineTreeviewItem<T>[] = [];
      item.children.forEach(child => {
        const links = this.getLinks(child, link);
        if (!isNil(links)) {
          result = result.concat(links);
        }
      });

      return result;
    }

    if (item.checked) {
      return [{
        item,
        parent
      }];
    }

    return null;
  }
}

@Injectable()
export class OrderDownlineTreeviewEventParser<T> extends TreeviewEventParser<T> {
  private currentDownlines: DownlineTreeviewItem<T>[] = [];
  private parser = new DownlineTreeviewEventParser();

  getSelectedChange(component: TreeviewComponent<T>): any[] {
    const newDownlines: DownlineTreeviewItem<T>[] = this.parser.getSelectedChange(component);
    if (this.currentDownlines.length === 0) {
      this.currentDownlines = newDownlines;
    } else {
      const intersectDownlines: DownlineTreeviewItem<T>[] = [];
      this.currentDownlines.forEach(downline => {
        let foundIndex = -1;
        const length = newDownlines.length;
        for (let i = 0; i < length; i++) {
          if (downline.item.value === newDownlines[i].item.value) {
            foundIndex = i;
            break;
          }
        }

        if (foundIndex !== -1) {
          intersectDownlines.push(newDownlines[foundIndex]);
          newDownlines.splice(foundIndex, 1);
        }
      });

      this.currentDownlines = intersectDownlines.concat(newDownlines);
    }

    return this.currentDownlines;
  }
}
