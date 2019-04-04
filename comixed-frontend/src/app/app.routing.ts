/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2017, The ComiXed Project
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'app/admin.guard';
import { ReaderGuard } from 'app/reader.guard';
import { MainPageComponent } from 'app/ui/pages/main-page/main-page.component';
import { AccountPageComponent } from 'app/ui/pages/account/account-page/account-page.component';
import { LibraryPageComponent } from 'app/ui/pages/library/library-page/library-page.component';
import { SeriesPageComponent } from 'app/ui/pages/series/series-page/series-page.component';
import { SeriesDetailsPageComponent } from 'app/ui/pages/series/series-details-page/series-details-page.component';
import { PublishersPageComponent } from 'app/ui/pages/publishers/publishers-page/publishers-page.component';
import { PublisherDetailsPageComponent } from 'app/ui/pages/publishers/publisher-details-page/publisher-details-page.component';
import { CharactersPageComponent } from 'app/ui/pages/characters/characters-page/characters-page.component';
import { CharacterDetailsPageComponent } from 'app/ui/pages/characters/character-details-page/character-details-page.component';
import { ComicDetailsComponent } from 'app/ui/pages/comic/comic-details/comic-details.component';
import { ImportPageComponent } from 'app/ui/pages/import-page/import-page.component';
import { DuplicatesPageComponent } from 'app/ui/pages/library/duplicates-page/duplicates-page.component';
import { UsersPageComponent } from 'app/ui/pages/admin/users-page/users-page.component';
import { TeamsPageComponent } from 'app/ui/pages/teams/teams-page/teams-page.component';
import { TeamDetailsPageComponent } from 'app/ui/pages/teams/team-details-page/team-details-page.component';
import { LocationsPageComponent } from 'app/ui/pages/locations/locations-page/locations-page.component';
import { LocationDetailsPageComponent } from 'app/ui/pages/locations/location-details-page/location-details-page.component';
import { StoryArcsPageComponent } from 'app/ui/pages/story-arcs/story-arcs-page/story-arcs-page.component';
import { StoryArcDetailsPageComponent } from 'app/ui/pages/story-arcs/story-arc-details-page/story-arc-details-page.component';
import { MultiComicScrapingPageComponent } from 'app/ui/pages/library/multi-comic-scraping-page/multi-comic-scraping-page.component';
import { LibraryAdminPageComponent } from 'app/ui/pages/admin/library-admin-page/library-admin-page.component';

export const routes: Routes = [
  { path: 'home', component: MainPageComponent },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'comics',
    component: LibraryPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'comics/:id',
    component: ComicDetailsComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'scraping',
    component: MultiComicScrapingPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'publishers',
    component: PublishersPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'publishers/:name',
    component: PublisherDetailsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'series',
    component: SeriesPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'series/:name',
    component: SeriesDetailsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'characters',
    component: CharactersPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'characters/:name',
    component: CharacterDetailsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'teams',
    component: TeamsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'teams/:name',
    component: TeamDetailsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'locations',
    component: LocationsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'locations/:name',
    component: LocationDetailsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'stories',
    component: StoryArcsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'stories/:name',
    component: StoryArcDetailsPageComponent,
    canActivate: [ReaderGuard]
  },
  {
    path: 'import',
    component: ImportPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'pages/duplicates',
    component: DuplicatesPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/users',
    component: UsersPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/library',
    component: LibraryAdminPageComponent,
    canActivate: [AdminGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouting {}
