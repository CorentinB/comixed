/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2018, The ComiXed Project
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
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LibraryAdaptor, SelectionAdaptor } from 'app/library';
import { UserService } from 'app/services/user.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationAdaptor, User } from 'app/user';
import { Title } from '@angular/platform-browser';
import { BreadcrumbAdaptor } from 'app/adaptors/breadcrumb.adaptor';
import { Comic } from 'app/comics';

@Component({
  selector: 'app-library-page',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.scss']
})
export class LibraryPageComponent implements OnInit, OnDestroy {
  authSubscription: Subscription;
  user: User;
  comicsSubscription: Subscription;
  comics: Comic[] = [];
  selectedComicsSubscription: Subscription;
  selectedComics: Comic[] = [];
  processingCount = 0;
  importCountSubscription: Subscription;
  langChangeSubscription: Subscription;

  constructor(
    private titleService: Title,
    private router: Router,
    private authenticationAdaptor: AuthenticationAdaptor,
    private libraryAdaptor: LibraryAdaptor,
    private selectionAdaptor: SelectionAdaptor,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private breadcrumbAdaptor: BreadcrumbAdaptor
  ) {}

  ngOnInit() {
    this.authSubscription = this.authenticationAdaptor.user$.subscribe(
      user => (this.user = user)
    );
    this.comicsSubscription = this.libraryAdaptor.comic$.subscribe(comics => {
      this.comics = comics;
      this.titleService.setTitle(
        this.translateService.instant('library-page.title', {
          count: this.comics.length
        })
      );
    });
    this.selectedComicsSubscription = this.selectionAdaptor.comicSelection$.subscribe(
      selected_comics => (this.selectedComics = selected_comics)
    );
    this.importCountSubscription = this.libraryAdaptor.processingCount$.subscribe(
      processing => (this.processingCount = processing)
    );
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      () => this.loadTranslations()
    );
    this.loadTranslations();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.comicsSubscription.unsubscribe();
    this.selectedComicsSubscription.unsubscribe();
    this.importCountSubscription.unsubscribe();
  }

  deleteComic(comic: Comic): void {
    this.confirmationService.confirm({
      header: this.translateService.instant(
        'library.messages.delete-comic-title'
      ),
      message: this.translateService.instant(
        'library.messages.delete-comic-question'
      ),
      icon: 'fa fa-exclamation',
      accept: () => this.libraryAdaptor.deleteComics([comic.id])
    });
  }

  openComic(comic: Comic): void {
    this.router.navigate(['comics', `${comic.id}`]);
  }

  rescanLibrary(): void {
    this.confirmationService.confirm({
      header: this.translateService.instant(
        'library.messages.rescan-library-title'
      ),
      message: this.translateService.instant(
        'library.messages.rescan-library-message'
      ),
      icon: 'fa fa-exclamation',
      accept: () => this.libraryAdaptor.startRescan()
    });
  }

  canRescan(): boolean {
    return this.processingCount === 0;
  }

  private loadTranslations() {
    this.breadcrumbAdaptor.loadEntries([
      { label: this.translateService.instant('breadcrumb.entry.library-page') }
    ]);
  }
}
