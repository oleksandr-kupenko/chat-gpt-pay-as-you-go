import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from './app.service';
import {Observable, Subscription} from 'rxjs';
import {SettingsMenuService} from './shared/services/settings-menu.service';
import {select, Store} from '@ngrx/store';
import {initConfigAction} from './state/app.actions';
import {Config} from './app.interface';
import {configSelector} from './state/app.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('keyInputRef') keyInputEl!: ElementRef;

  public config$!: Observable<Config | null>;

  public isLoading = signal(false);
  public settingsForm!: FormGroup;
  public currentKey = signal('');

  public isKeyFieldReadOnly = true;

  public isSettingsMenuOpened = signal(false);

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private settingsBtnService: SettingsMenuService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.store.dispatch(initConfigAction());
    this.config$ = this.store.pipe(select(configSelector));

    this.initApiKey();
    this.initSettingsForm();
    this.subscribeToIsSettingsOpen();
  }

  ngAfterViewInit() {
    this.subs.unsubscribe();
  }

  public handleSaveSettings() {
    const key = this.settingsForm.value.key;
    this.currentKey.set(key);
    this.appService.saveKey(key);
  }

  public handleDeleteKey() {
    this.currentKey.set('');
    this.appService.deleteKey();
    this.settingsForm.patchValue({key: ''});
  }

  public handleKeyInput() {
    this.settingsForm.get('key')?.markAsTouched();
    if (!this.settingsForm.get('key')?.value) {
      this.isKeyFieldReadOnly = true;
      setTimeout(() => {
        this.isKeyFieldReadOnly = false;
        this.keyInputEl.nativeElement.click();
      });
    }
  }

  public handleEnableInput() {
    this.isKeyFieldReadOnly = false;
  }

  public handleCloseSettingsMenu() {
    this.settingsBtnService.toggleIsMenuOpen();
  }

  private initSettingsForm() {
    this.settingsForm = this.fb.group({
      key: [this.currentKey(), Validators.required],
    });
  }

  private initApiKey() {
    this.appService.initKey();
    this.currentKey.set(this.appService.getKey() || '');
  }

  private subscribeToIsSettingsOpen() {
    this.settingsBtnService.getIsMenuOpen.subscribe((data) => {
      this.isSettingsMenuOpened.set(data.status);
      if (data.keyError) {
        this.settingsForm.get('key')?.markAsTouched();
      }
    });
  }
}
