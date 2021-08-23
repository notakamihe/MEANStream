import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToPlaylistModalComponent } from './add-to-playlist-modal.component';

describe('AddToPlaylistModalComponent', () => {
  let component: AddToPlaylistModalComponent;
  let fixture: ComponentFixture<AddToPlaylistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToPlaylistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToPlaylistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
