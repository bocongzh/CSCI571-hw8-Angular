import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {

  transform(value: string): string {
    if(value.length<=40) return value;
    else {
      return value.substring(0,36)+"...";
    }
  }

}
