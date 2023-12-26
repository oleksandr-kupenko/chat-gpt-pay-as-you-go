import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsMenuService {
  isMenuOpen = new BehaviorSubject<{status: boolean; keyError: boolean}>({status: false, keyError: false});

  public getIsMenuOpen = this.isMenuOpen.asObservable();

  public toggleIsMenuOpen(apiKeyError?: boolean) {
    if (apiKeyError) {
      this.isMenuOpen.next({status: true, keyError: true});
    } else {
      this.isMenuOpen.next({status: !this.isMenuOpen.value.status, keyError: false});
    }
  }
}
