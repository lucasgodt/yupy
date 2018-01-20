import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'new-service',
  templateUrl: 'new-service.html',
})
export class NewServicePage {

  profile = {} as Profile;

  constructor(private navCtrl: NavController, private navParams: NavParams, private toast: ToastController) {
    this.profile = this.navParams.get('existingProfile');
  }

  saveServiceResult(event: Boolean){
    event ? this.navCtrl.setRoot('TabsPage') : this.toast.create({
            message: "Selecione uma categoria",
            duration: 3000
          }).present();;
  }

}
