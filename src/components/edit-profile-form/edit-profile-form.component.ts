import { Component, OnDestroy, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavController, NavParams } from 'ionic-angular';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile/profile.interface';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
/**
 * Generated class for the EditProfileFormComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-edit-profile-form',
  templateUrl: 'edit-profile-form.component.html'
})
export class EditProfileFormComponent implements OnInit, OnDestroy {

  private authenticatedUser$: Subscription;
  private authenticatedUser: User;

  @Output() saveProfileResult: EventEmitter<Boolean>;

  @Input() profile: Profile;

  constructor(private auth: AuthService, private data: DataService, private navCtrl: NavController, private navParams: NavParams) {
    this.saveProfileResult = new EventEmitter<Boolean>();
    this.authenticatedUser$ = this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user
    })
  }

  async saveProfile(){
    if(this.authenticatedUser){
    this.profile.$key = this.authenticatedUser.uid;
    const result = await this.data.saveProfile(this.authenticatedUser, this.profile);
    this.saveProfileResult.emit(result);
    }
  }

  createService(){
    //CRIA SERVIÇO!!!!!
    this.navCtrl.push('NewServicePage',{existingProfile: this.profile});
  }

  ngOnInit(): void{
    if(!this.profile){
      this.profile = {} as Profile;
      this.profile.services = [];
    }
  }

  ngOnDestroy(): void{
    this.authenticatedUser$.unsubscribe();
  }

}
