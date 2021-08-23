import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollectionDetailComponent } from './components/collection-detail/collection-detail.component';
import { ExploreComponent } from './components/explore/explore.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlayerComponent } from './components/player/player.component';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SongDetailComponent } from './components/song-detail/song-detail.component';
import { StartComponent } from './components/start/start.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxBottomNavModule, IgxIconModule, IgxAvatarModule } from "igniteui-angular";
import { BottomTabsComponent } from './components/bottom-tabs/bottom-tabs.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SongComponent } from './components/reusable/song/song.component';
import { CollectionComponent } from './components/reusable/collection/collection.component';
import { CommentComponent } from './components/reusable/comment/comment.component';
import { CarouselModule } from "angular-bootstrap-md";
import { UserComponent } from './components/reusable/user/user.component';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from "ngx-electron";
import { ListComponent } from './components/list/list.component';
import { BackComponent } from './components/reusable/back/back.component';
import { CreateComponent } from './components/create/create.component';
import { CreateSongComponent } from './components/create-song/create-song.component';
import { CreateCollectionComponent } from './components/create-collection/create-collection.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditSongComponent } from './components/edit-song/edit-song.component';
import { EditCollectionComponent } from './components/edit-collection/edit-collection.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AddToPlaylistModalComponent } from './components/reusable/add-to-playlist-modal/add-to-playlist-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { CurrentUserService } from './services/current-user/current-user.service';
import { ErrorComponent } from './components/reusable/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    CollectionDetailComponent,
    ExploreComponent,
    HomeComponent,
    LoginComponent,
    PlayerComponent,
    RegisterComponent,
    SettingsComponent,
    SongDetailComponent,
    StartComponent,
    UserDetailComponent,
    BottomTabsComponent,
    SongComponent,
    CollectionComponent,
    CommentComponent,
    UserComponent,
    ListComponent,
    BackComponent,
    CreateComponent,
    CreateSongComponent,
    CreateCollectionComponent,
    EditProfileComponent,
    EditSongComponent,
    EditCollectionComponent,
    ChangePasswordComponent,
    AddToPlaylistModalComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxBottomNavModule,
    IgxIconModule,
    MatIconModule,
    IgxAvatarModule,
    CarouselModule,
    FormsModule,
    NgxElectronModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [CurrentUserService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
