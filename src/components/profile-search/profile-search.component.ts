import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../providers/data/data.service';
import { Profile } from '../../models/profile/profile.interface';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';
import { Need } from '../../models/need/need.interface';

/**
 * Generated class for the ProfileSearchComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-profile-search',
  templateUrl: 'profile-search.component.html'
})
export class ProfileSearchComponent implements OnInit, OnDestroy {

  query: string;

  need: Need;

  profileList: Profile[]

  private authenticatedUser$: Subscription;
  private authenticatedUser: User;

  userProfile: Profile;

  @Output() selectedProfile: EventEmitter<Profile>;

  constructor(private data: DataService, private auth: AuthService) {
    this.selectedProfile = new EventEmitter<Profile>();
    this.authenticatedUser$ = this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user
    })

  }

  async saveProfile(profile: Profile){
    if(this.authenticatedUser){
    const result = await this.data.saveProfile(this.authenticatedUser, profile);
    }
  }

  selectProfile(profile: Profile){
    this.selectedProfile.emit(profile);
  }

  searchUser(query: string){

  }

  ngOnInit(): void{

  }

  ngOnDestroy(): void{
    this.authenticatedUser$.unsubscribe();
  }

}
