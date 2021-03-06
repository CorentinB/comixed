/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2019, The ComiXed Project.
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

import java.util.*;
import org.comixed.model.library.*;
import org.comixed.repositories.library.BlockedPageHashRepository;
import org.comixed.repositories.library.ComicRepository;
import org.comixed.repositories.library.PageRepository;
import org.comixed.repositories.library.PageTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PageService {
  protected final Logger logger = LoggerFactory.getLogger(this.getClass());

  @Autowired private PageRepository pageRepository;
  @Autowired private PageTypeRepository pageTypeRepository;
  @Autowired private BlockedPageHashRepository blockedPageHashRepository;
  @Autowired private ComicRepository comicRepository;

  @Transactional
  public Page updateTypeForPage(final long id, final long typeId) throws PageException {
    this.logger.debug("Setting page type for page: id={} page type={}", id, typeId);

    final Optional<Page> page = this.pageRepository.findById(id);
    final Optional<PageType> pageType = this.pageTypeRepository.findById(typeId);

    if (page.isPresent()) {
      if (pageType.isPresent()) {
        final Page record = page.get();

        record.setPageType(pageType.get());

        this.logger.debug("Updating page with  new type");
        return this.pageRepository.save(record);
      } else {
        throw new PageException("Invalid page type: id=" + typeId);
      }
    } else {
      throw new PageException("No such page: id=" + id);
    }
  }

  @Transactional
  public Comic addBlockedPageHash(final long pageId, final String hash) throws PageException {
    this.logger.debug("Adding blocked page hash: {}", hash);
    BlockedPageHash existing = this.blockedPageHashRepository.findByHash(hash);

    if (existing != null) {
      this.logger.debug("Blocked page hash already exists");
    } else {
      existing = new BlockedPageHash(hash);
      this.blockedPageHashRepository.save(existing);
    }

    final Optional<Page> page = this.pageRepository.findById(pageId);

    if (page.isPresent()) {
      return page.get().getComic();
    }

    throw new PageException("no such page: id=" + pageId);
  }

  @Transactional
  public Comic removeBlockedPageHash(final long pageId, final String hash) throws PageException {
    this.logger.debug("Removing blocked page hash: {}", hash);
    final BlockedPageHash entry = this.blockedPageHashRepository.findByHash(hash);
    if (entry == null) {
      this.logger.debug("No such hash");
    } else {
      this.blockedPageHashRepository.delete(entry);
    }

    final Optional<Page> page = this.pageRepository.findById(pageId);

    if (page.isPresent()) {
      return page.get().getComic();
    }

    throw new PageException("no such page: id=" + pageId);
  }

  public List<String> getAllBlockedPageHashes() {
    this.logger.debug("Returning all blocked page hashes");

    return this.blockedPageHashRepository.getAllHashes();
  }

  public Page getPageInComicByIndex(final long comicId, final int pageIndex) {
    this.logger.debug(
        "Getting page content for comic: comic id={} page index={}", comicId, pageIndex);

    this.logger.debug("Fetching comic: id={}", comicId);
    final Optional<Comic> comic = this.comicRepository.findById(comicId);

    if (comic.isPresent()) {
      if (pageIndex < comic.get().getPageCount()) {
        this.logger.debug("Returning page");
        return comic.get().getPage(pageIndex);
      } else {
        this.logger.warn("Index out of range");
      }
    } else {
      this.logger.warn("No such comic");
    }

    return null;
  }

  @Transactional
  public Page deletePage(final long id) {
    this.logger.debug("Marking page as deleted: id={}", id);
    final Optional<Page> page = this.pageRepository.findById(id);

    if (page.isPresent()) {
      if (page.get().isMarkedDeleted()) {
        this.logger.debug("Page was already marked as deleted");
        return page.get();
      } else {
        page.get().markDeleted(true);
        final Page result = this.pageRepository.save(page.get());
        this.logger.debug("Page deleted");
        return result;
      }
    }

    this.logger.warn("No such page");
    return null;
  }

  @Transactional
  public Page undeletePage(final long id) {
    this.logger.debug("Marking page as not deleted: id={}", id);

    final Optional<Page> page = this.pageRepository.findById(id);

    if (page.isPresent()) {
      if (page.get().isMarkedDeleted()) {
        page.get().markDeleted(false);
        this.logger.debug("Page undeleted");
        return this.pageRepository.save(page.get());

      } else {
        this.logger.debug("Page was not marked as deleted");
        return page.get();
      }
    } else {
      this.logger.warn("No such page");
    }
    return null;
  }

  public Page findById(final long id) {
    this.logger.debug("Getting page by id: id={}", id);

    final Optional<Page> result = this.pageRepository.findById(id);

    if (!result.isPresent()) {
      this.logger.warn("No such page");
      return null;
    }

    return result.get();
  }

  public List<Page> getAllPagesForComic(final long comicId) {
    this.logger.debug("Getting all pages for comic: id={}", comicId);

    return this.pageRepository.findAllByComicId(comicId);
  }

  public List<PageType> getPageTypes() {
    this.logger.debug("Getting all page types");

    return this.pageTypeRepository.findPageTypes();
  }

  @Transactional
  public int deleteAllWithHash(final String hash) {
    this.logger.debug("Deleting pages by hash: {}", hash);

    final int result = this.pageRepository.updateDeleteOnAllWithHash(hash, true);

    this.logger.debug("Update affected {} record{}", result, result == 1 ? "" : "s");

    return result;
  }

  @Transactional
  public int undeleteAllWithHash(final String hash) {
    this.logger.debug("Undeleting pages by hash: {}", hash);

    final int result = this.pageRepository.updateDeleteOnAllWithHash(hash, false);

    this.logger.debug("Update affected {} record{}", result, result == 1 ? "" : "s");

    return result;
  }

  @Transactional
  public List<DuplicatePage> setBlockingState(final List<String> hashes, final boolean blocked) {
    this.logger.debug(
        "Updating {} hash{} to {}blocked",
        hashes.size(),
        hashes.size() == 1 ? "" : "es",
        blocked ? "" : "un");

    for (String hash : hashes) {
      BlockedPageHash entry = this.blockedPageHashRepository.findByHash(hash);

      if (blocked) {
        if (entry == null) {
          entry = new BlockedPageHash(hash);
          this.logger.debug("Creating entry for hash: {}", hash);
          this.blockedPageHashRepository.save(entry);
        } else {
          this.logger.debug("Hash already blocked: {}", hash);
        }
      } else {
        if (entry != null) {
          this.logger.debug("Deleting entry for hash: {}", hash);
          this.blockedPageHashRepository.delete(entry);
        } else {
          this.logger.debug("Hash not already blocked: {}", hash);
        }
      }
    }

    return this.getDuplicatePages();
  }

  @Transactional(isolation = Isolation.READ_UNCOMMITTED)
  public List<DuplicatePage> getDuplicatePages() {
    this.logger.debug("Getting pages from repository");
    final List<Page> pages = this.pageRepository.getDuplicatePages();

    this.logger.debug("Build duplicate page list");
    Map<String, DuplicatePage> mapped = new HashMap<>();
    for (Page page : pages) {
      DuplicatePage entry = mapped.get(page.getHash());

      if (entry == null) {
        entry = new DuplicatePage();

        entry.setHash(page.getHash());
        entry.setBlocked(page.isBlocked());
        mapped.put(entry.getHash(), entry);
      }
      entry.getPages().add(page);
    }

    return new ArrayList<>(mapped.values());
  }

  @Transactional
  public void setDeletedState(final List<String> hashes, final boolean deleted) {
    for (int index = 0; index < hashes.size(); index++) {
      final String hash = hashes.get(index);
      this.logger.debug("Loading pages with hash: {}", hash);
      final List<Page> pages = this.pageRepository.getPagesWithHash(hash);
      for (int pageIndex = 0; pageIndex < pages.size(); pageIndex++) {
        final Page page = pages.get(pageIndex);
        this.logger.debug("Marking page deleted flag: id={} deleted={}", page.getId(), deleted);
        page.markDeleted(deleted);
        this.pageRepository.save(page);
      }
    }
  }
}
