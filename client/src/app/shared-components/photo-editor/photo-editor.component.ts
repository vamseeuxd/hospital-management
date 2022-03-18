import {Component, Input} from '@angular/core';
import {CroppedEvent, NgxPhotoEditorComponent} from 'ngx-photo-editor';

@Component({
  selector: 'app-tat-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent {

  imageChangedEvent: any;
  @Input() base64: any;
  @Input() value: any;

  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    console.log(event);
  }

  imageCropped(event: CroppedEvent) {
    this.base64 = event.base64;
  }
}
