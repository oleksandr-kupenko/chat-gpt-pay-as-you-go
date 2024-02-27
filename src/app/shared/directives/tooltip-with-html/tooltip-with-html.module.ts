import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  TooltipComponent,
  TooltipWithHtmlDirective,
} from './tooltip-with-html.directive';
import {MatCommonModule} from '@angular/material/core';
import {CdkScrollableModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [TooltipWithHtmlDirective, TooltipComponent],
  imports: [CommonModule, MatCommonModule],
  exports: [TooltipWithHtmlDirective, TooltipComponent, CdkScrollableModule],
  providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class TooltipWithHtmlModule {}
