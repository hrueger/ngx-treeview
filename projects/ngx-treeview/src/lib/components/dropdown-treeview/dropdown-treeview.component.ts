﻿import { Component, EventEmitter, Input, Output, ViewChild, TemplateRef } from '@angular/core';
import { TreeviewI18n } from '../../models/treeview-i18n';
import { TreeviewItem } from '../../models/treeview-item';
import { TreeviewConfig } from '../../models/treeview-config';
import { TreeviewComponent } from '../treeview/treeview.component';
import { TreeviewHeaderTemplateContext } from '../../models/treeview-header-template-context';
import { TreeviewItemTemplateContext } from '../../models/treeview-item-template-context';

@Component({
  selector: 'ngx-dropdown-treeview',
  templateUrl: './dropdown-treeview.component.html',
  styleUrls: ['./dropdown-treeview.component.scss']
})
export class DropdownTreeviewComponent<T> {
  @Input() buttonClass = 'btn-outline-secondary';
  @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext<T>>;
  @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext<T>>;
  @Input() items: TreeviewItem<T>[];
  @Input() config: TreeviewConfig;
  @Output() selectedChange = new EventEmitter<any[]>(true);
  @Output() filterChange = new EventEmitter<string>();
  @ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent<T>;
  buttonLabel: string;

  constructor(
    public i18n: TreeviewI18n<T>,
    private defaultConfig: TreeviewConfig
  ) {
    this.config = this.defaultConfig;
  }

  onSelectedChange(values: any[]): void {
    this.buttonLabel = this.i18n.getText(this.treeviewComponent.selection);
    this.selectedChange.emit(values);
  }

  onFilterChange(text: string): void {
    this.filterChange.emit(text);
  }
}
