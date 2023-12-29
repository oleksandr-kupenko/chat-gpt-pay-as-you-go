import {Pipe, PipeTransform} from '@angular/core';
import * as marked from 'marked';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'safeMarked',
  standalone: true,
})
export class SafeMarkedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    // const stringValue = JSON.stringify(value);

    // if (stringValue.includes('\\n```')) {
    //   value = this.fixeSingleNewLineBeforeCode(value);
    // }

    const markedHtml = marked.parse(value);
    return this.sanitizer.bypassSecurityTrustHtml(markedHtml as string);
  }

  fixeSingleNewLineBeforeCode(inputString: string) {
    //sometimes gpt return single /n before ```, and marked doesn't understand it
    return inputString.replace(/\n(?!```)/g, '\n\n');
  }
}
