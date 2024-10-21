import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fahrenheitToCelsius'
})
export class FahrenheitToCelsiusPipe implements PipeTransform {
  transform(value: number): number {
    if (!value && value !== 0) {
      return NaN;
    }
    return ((value - 32) * 5) / 9;
  }
}
