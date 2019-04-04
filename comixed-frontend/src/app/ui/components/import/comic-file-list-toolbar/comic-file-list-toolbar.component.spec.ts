/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2019, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.package
 * org.comixed;
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from 'app/app.state';
import { importingReducer } from 'app/reducers/importing.reducer';
import * as ImportActions from 'app/actions/importing.actions';
import { ComicFileListToolbarComponent } from './comic-file-list-toolbar.component';
import { DebugElement } from '@angular/core';
import {
  ButtonModule,
  CheckboxModule,
  DropdownModule,
  InputTextModule,
  SliderModule,
  ToolbarModule
} from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DEFAULT_LIBRARY_DISPLAY } from 'app/models/state/library-display.fixtures';

const DIRECTORY_TO_SEARCH = '/Users/comixed/library';

describe('ComicFileListToolbarComponent', () => {
  let component: ComicFileListToolbarComponent;
  let fixture: ComponentFixture<ComicFileListToolbarComponent>;
  let directory_input: DebugElement;
  let find_comics_button: DebugElement;
  let store: Store<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        StoreModule.forRoot({
          importing: importingReducer
        }),
        TranslateModule.forRoot(),
        ToolbarModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        CheckboxModule,
        SliderModule
      ],
      declarations: [ComicFileListToolbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComicFileListToolbarComponent);
    component = fixture.componentInstance;
    component.library_display = DEFAULT_LIBRARY_DISPLAY;
    component.busy = false;
    component.directory = '';
    store = TestBed.get(Store);

    fixture.detectChanges();

    directory_input = fixture.debugElement.query(By.css('#directory-input'));
    find_comics_button = fixture.debugElement.query(By.css('#find-comics'));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#importing-toolbar'))).toBeTruthy();
  });

  describe('when no directory is entered', () => {
    beforeEach(() => {
      component.directory = '';
      fixture.detectChanges();
    });

    it('disables the search button', () => {
      expect(find_comics_button.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('when a directory is entered', () => {
    beforeEach(() => {
      component.busy = false;
      component.directory = DIRECTORY_TO_SEARCH;
      fixture.detectChanges();
    });

    it('enables the search button', () => {
      expect(find_comics_button.nativeElement.disabled).toBeFalsy();
    });

    it('starts finding comics when the search button is clicked', () => {
      spyOn(store, 'dispatch').and.stub();
      find_comics_button.triggerEventHandler('click', null);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(store.dispatch).toHaveBeenCalledWith(new ImportActions.ImportingSetDirectory({ directory: DIRECTORY_TO_SEARCH }));
        expect(store.dispatch).toHaveBeenCalledWith(new ImportActions.ImportingFetchFiles({ directory: DIRECTORY_TO_SEARCH }));
      });
    });
  });
});
