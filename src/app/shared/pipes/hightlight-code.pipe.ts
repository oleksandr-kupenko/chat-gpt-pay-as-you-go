import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'highlightCode',
  standalone: true,
})
export class HighlightCodePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: SafeHtml): SafeHtml {
    if (!value) return value;

    const stringValue = value.toString();
    const doc = new DOMParser().parseFromString(stringValue, 'text/html');

    const codeElements = doc.querySelectorAll('code.language-javascript, code.language-js');
    codeElements.forEach((codeElement) => {
      const lang = codeElement.className.replace('language-', '');
      codeElement.outerHTML = `<code class="language-${lang}" highlight-js [lang]="'language-${lang}'">${codeElement.innerHTML}</code>`;
    });

    const modifiedValue = doc.documentElement.innerHTML;

    return this.sanitizer.bypassSecurityTrustHtml(modifiedValue);
  }
}
