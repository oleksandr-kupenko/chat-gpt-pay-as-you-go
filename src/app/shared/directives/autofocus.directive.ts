import {AfterContentInit, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterContentInit {
  public constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 100);
  }
}
