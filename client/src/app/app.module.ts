import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { CarouselModule } from "angular-bootstrap-md";
import { NgxElectronModule } from "ngx-electron";
import { CurrentUserService } from './services/current-user/current-user.service';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import {MatIconModule} from "@angular/material/icon"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSlideToggleModule} from "@angular/material/slide-toggle"

import * as components from './components';
import * as pipes from './pipes';
import { ThemeService } from './services/theme/theme.service';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    components.CollectionDetailComponent,
    components.ExploreComponent,
    components.HomeComponent,
    components.LoginComponent,
    components.RegisterComponent,
    components.SettingsComponent,
    components.SongDetailComponent,
    components.StartComponent,
    components.UserDetailComponent,
    components.BottomTabsComponent,
    components.SongComponent,
    components.CollectionComponent,
    components.CommentComponent,
    components.UserComponent,
    components.ListComponent,
    components.BackComponent,
    components.CreateComponent,
    components.CreateSongComponent,
    components.CreateCollectionComponent,
    components.EditProfileComponent,
    components.EditSongComponent,
    components.EditCollectionComponent,
    components.ChangePasswordComponent,
    components.AddToPlaylistModalComponent,
    components.ErrorComponent,
    components.PlayerComponent,
    components.AvatarComponent,
    pipes.NumberAbbreviationPipe,
    pipes.TimeAgoPipe,
    pipes.CollectionCasePipe
  ],
  imports: [
    FormsModule,
    CoreModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    CarouselModule,
    NgxElectronModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule,
    NgbModalModule,
    MatSlideToggleModule
  ],
  providers: [CurrentUserService, ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
