import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from "firebase/app";
import { Profile } from "../../models/profile/profile.interface";
import { LoadingController, Loading } from "ionic-angular";
import { NavParams, NavController } from 'ionic-angular';

/**
 * Generated class for the ProfileViewComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-profile-view',
  templateUrl: 'profile-view.component.html'
})
export class ProfileViewComponent implements OnInit {

  public userProfile: Profile;
  public authUser: boolean = false;
  private loader: Loading;

  @Output() authenticatedUser: EventEmitter<boolean>;

  @Output() existingProfile: EventEmitter<Profile>;

  constructor(private navCtrl: NavController, private loading: LoadingController, private data: DataService, private auth: AuthService,private nav: NavParams) {

    this.existingProfile = new EventEmitter<Profile>();
    this.authenticatedUser = new EventEmitter<boolean>();

    this.loader = this.loading.create({
      content:"Carregando o perfil..."
    });
  }

  ngOnInit(): void{
    this.loader.present();
    this.userProfile = this.nav.get('profile');
    //Mudar para pegar navParams, o profile a ser mostrado será escolhido pela pagina anterior
    if(!this.userProfile){
    this.authUser = true;
    this.data.getAuthenticatedUserProfile().subscribe(profile => {
      this.userProfile = profile;
      //this.userProfile.services = [];
      this.existingProfile.emit(this.userProfile);
      this.authenticatedUser.emit(this.authUser);

    })

  }else{
    this.existingProfile.emit(this.userProfile);
  }
    this.loader.dismiss();
  }

}
