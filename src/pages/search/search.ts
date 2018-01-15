import { Component, OnInit, OnDestroy  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { Profile } from '../../models/profile//profile.interface';
import { AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'firebase/app';

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage implements OnInit, OnDestroy {

  authenticate: Boolean;
  radioOpen: boolean;
  radioResult;

  private authenticatedUser$: Subscription;
  private authenticatedUser: User;

  constructor(private auth: AuthService, private navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController) {
    this.authenticatedUser$ = this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user
    })
  }

  openProfile(profile: Profile){
    this.navCtrl.push('ProfilePage',{ profile });
  }

  ngOnInit(): void{
    if(this.authenticatedUser){
      this.authenticate = true;
    }else{
      this.authenticate = false;
    }
  }

  navigateToPage(pageName: string):void{
    this.navCtrl.push(pageName);
  }

  showRadio() {
      let alert = this.alertCtrl.create();
      alert.setTitle('Escolha seu serviço');

      alert.addInput({
        type: 'radio',
        label: 'Mecânicos',
        value: 'mecanicos',
      });


      alert.addInput({
        type: 'radio',
        label: 'Eletricistas',
        value: 'eletricistas',
      });

      alert.addButton('Cancelar');
      alert.addButton({
        text: 'OK',
        handler: data => {
          this.radioOpen = false;
          this.radioResult = data;
        }
      });

      alert.present().then(() => {
        this.radioOpen = true;
      });
    }

    ngOnDestroy(): void{
      this.authenticatedUser$.unsubscribe();
    }

}
