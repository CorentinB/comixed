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
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { LibraryActions, LibraryActionTypes } from '../actions/library.actions';
import { mergeComics } from 'app/library/utility.functions';
import { Comic } from 'app/comics';
import { LastReadDate } from 'app/library/models/last-read-date';

export const LIBRARY_FEATURE_KEY = 'library_state';

export interface LibraryState {
  fetchingUpdates: boolean;
  comics: Comic[];
  lastComicId: number;
  moreUpdates: boolean;
  updatedIds: number[];
  lastReadDates: LastReadDate[];
  comicCount: number;
  latestUpdatedDate: Date;
  processingCount: number;
  startingRescan: boolean;
  deletingComics: boolean;
}

export const initialState: LibraryState = {
  fetchingUpdates: false,
  comics: [],
  lastComicId: 0,
  moreUpdates: false,
  updatedIds: [],
  lastReadDates: [],
  comicCount: 0,
  latestUpdatedDate: new Date(0),
  processingCount: 0,
  startingRescan: false,
  deletingComics: false
};

export function reducer(
  state = initialState,
  action: LibraryActions
): LibraryState {
  switch (action.type) {
    case LibraryActionTypes.Reset:
      return { ...state, comics: [] };

    case LibraryActionTypes.GetUpdates:
      return { ...state, fetchingUpdates: true };

    case LibraryActionTypes.UpdatesReceived: {
      const comics = mergeComics(state.comics, action.payload.comics);
      const lastComicId = action.payload.lastComicId || state.lastComicId;
      const latestUpdatedDate =
        action.payload.mostRecentUpdate || state.latestUpdatedDate;

      return {
        ...state,
        fetchingUpdates: false,
        comics: comics,
        lastComicId: lastComicId,
        latestUpdatedDate: latestUpdatedDate,
        moreUpdates: action.payload.moreUpdates,
        updatedIds: action.payload.comics.map(comic => comic.id),
        lastReadDates: action.payload.lastReadDates,
        processingCount: action.payload.processingCount
      };
    }

    case LibraryActionTypes.GetUpdatesFailed:
      return { ...state, fetchingUpdates: false };

    case LibraryActionTypes.StartRescan:
      return { ...state, startingRescan: true };

    case LibraryActionTypes.RescanStarted:
      return { ...state, startingRescan: false };

    case LibraryActionTypes.RescanFailedToStart:
      return { ...state, startingRescan: false };

    case LibraryActionTypes.DeleteMultipleComics:
      return { ...state, deletingComics: true };

    case LibraryActionTypes.MultipleComicsDeleted:
      return { ...state, deletingComics: false };

    case LibraryActionTypes.DeleteMultipleComicsFailed:
      return { ...state, deletingComics: false };

    default:
      return state;
  }
}
