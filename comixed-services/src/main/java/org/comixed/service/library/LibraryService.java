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

package org.comixed.service.library;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.comixed.model.library.Comic;
import org.comixed.model.user.LastReadDate;
import org.comixed.repositories.library.ComicRepository;
import org.comixed.repositories.tasks.ProcessComicEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class LibraryService {
  protected final Logger logger = LoggerFactory.getLogger(this.getClass());

  @Autowired private ComicRepository comicRepository;
  @Autowired private ProcessComicEntryRepository processComicEntryRepository;

  public List<Comic> getComicsUpdatedSince(
      String email, Date latestUpdatedDate, int maximumComics, long lastComicId) {
    this.logger.debug(
        "Finding up to {} comics updated since {} for {}", maximumComics, latestUpdatedDate, email);

    List<Comic> comics =
        this.comicRepository.getLibraryUpdates(latestUpdatedDate, PageRequest.of(0, maximumComics));
    List<Comic> result = new ArrayList<>();

    final long timestamp = latestUpdatedDate.getTime();
    for (int index = 0; index < comics.size(); index++) {
      Comic comic = comics.get(index);
      final long thisTimestamp = comic.getDateLastUpdated().getTime();
      final Long thisId = comic.getId();
      this.logger.debug(
          "Checking comic: timestamp: {} >= {} id: {} > {}",
          thisTimestamp,
          timestamp,
          thisId,
          lastComicId);
      boolean include = thisTimestamp > timestamp || thisId > lastComicId;

      if (include) {
        this.logger.debug("Including comic: id={}", thisId);
        result.add(comic);
      }
    }

    this.logger.debug("Returning {} updated comic{}", result.size(), result.size() == 1 ? "" : "s");
    return result;
  }

  public List<LastReadDate> getLastReadDatesSince(String email, Date lastReadDate) {
    return null;
  }

  public long getProcessingCount() {
    this.logger.debug("Getting processing count");
    return this.processComicEntryRepository.count();
  }
}
