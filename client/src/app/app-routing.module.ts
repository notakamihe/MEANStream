import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { BottomTabsComponent } from './components/bottom-tabs/bottom-tabs.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CollectionDetailComponent } from './components/collection-detail/collection-detail.component';
import { EditCollectionComponent } from './components/edit-collection/edit-collection.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditSongComponent } from './components/edit-song/edit-song.component';
import { ExploreComponent } from './components/explore/explore.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateCollectionComponent } from './components/create-collection/create-collection.component';
import { CreateSongComponent } from './components/create-song/create-song.component';
import { CreateComponent } from './components/create/create.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SongDetailComponent } from './components/song-detail/song-detail.component';
import { StartComponent } from './components/start/start.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

const routes: Routes = [
    { path: "", component: StartComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    {
        path: "tabs", 
        component: BottomTabsComponent, 
        children: [
            {path: "", component: HomeComponent},
            {path: "explore", component: ExploreComponent},
            {path: "settings", component: SettingsComponent},
            {path: "create", component: CreateComponent},
            {path: "create/song", component: CreateSongComponent},
            {path: "create/collection", component: CreateCollectionComponent},
            {path: "profile/edit", component: EditProfileComponent},
            {path: "profile/change-password", component: ChangePasswordComponent},
            {path: "users/:username", component: UserDetailComponent},
            {path: "users/:username/songs", component: ListComponent},
            {path: "users/:username/collections", component: ListComponent},
            {path: "users/:username/liked", component: ListComponent},
            {path: "users/:username/comments", component: ListComponent},
            {path: "users/:username/songs/:slug", component: SongDetailComponent},
            {path: "users/:username/songs/:slug/edit", component: EditSongComponent},
            {path: "users/:username/collections/:slug", component: CollectionDetailComponent},
            {path: "users/:username/collections/:slug/edit", component: EditCollectionComponent},
        ] 
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor(router: Router) { }
}
