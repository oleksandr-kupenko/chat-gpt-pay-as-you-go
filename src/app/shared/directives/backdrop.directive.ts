import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appBackdrop]',
  standalone: true,
})
export class BackdropDirective implements OnInit {
  @Input() backdropDelay = 0;
  @Output() public clickOutside = new EventEmitter();

  private isActive = false;

  constructor(private _elementRef: ElementRef) {}

  ngOnInit() {
    if (this.backdropDelay > 0) {
      setTimeout(() => {
        this.isActive = true;
      }, this.backdropDelay);
    } else {
      this.isActive = true;
    }
  }
  @HostListener('document:click', ['$event.target']) public onClick(targetElement: EventTarget) {
    if (this.isActive) {
      const clickedInside = this._elementRef.nativeElement.contains(targetElement);

      if (!clickedInside) {
        this.clickOutside.emit(null);
      }
    }
  }
}
