import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', standalone: true })
export class FilterPipe implements PipeTransform {
  transform(items: any[], term: string, field: string): any[] {
    if (!term || !items) return items;
    term = term.toLowerCase();
    return items.filter(item => item[field].toLowerCase().includes(term));
  }
}
