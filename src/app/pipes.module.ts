import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FahrenheitToCelsiusPipe } from './fahrenheit-to-celsius.pipe';

@NgModule({
  declarations: [FahrenheitToCelsiusPipe],
  imports: [CommonModule],
  exports: [FahrenheitToCelsiusPipe]
})
export class PipesModule { }
