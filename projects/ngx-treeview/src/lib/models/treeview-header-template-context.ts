import { TreeviewItem } from './treeview-item';
import { TreeviewConfig } from './treeview-config';

export interface TreeviewHeaderTemplateContext<T> {
  config: TreeviewConfig;
  item: TreeviewItem<T>;
  onCollapseExpand: () => void;
  onCheckedChange: (checked: boolean) => void;
  onFilterTextChange: (text: string) => void;
}
