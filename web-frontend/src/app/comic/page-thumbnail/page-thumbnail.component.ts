import {Component, OnInit, Input} from '@angular/core';

import {ComicService} from '../comic.service';
import {Page} from '../page.model';

@Component({
  selector: 'app-page-thumbnail',
  templateUrl: './page-thumbnail.component.html',
  styleUrls: ['./page-thumbnail.component.css']
})
export class PageThumbnailComponent implements OnInit {
  @Input() page: Page;
  page_url = "";
  show_details = false;
  width = 192;
  height = 256;

  constructor(private comicService: ComicService) {}

  ngOnInit() {
    this.page_url = this.comicService.getImageUrlForId(this.page.id);
  }

}