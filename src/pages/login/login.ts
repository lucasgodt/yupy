import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginResponse } from '../../models/login/login-response.interface';
import { ToastController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { User } from 'firebase/app';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private data: DataService, private toast: ToastController, private navCtrl: NavController, private navParams: NavParams) {
  }

  login(event: LoginResponse){
    if(!event.error){
      this.data.getProfile(<User>event.result).subscribe(profile => {
        console.log(profile);
        profile.val() ? this.navCtrl.setRoot('TabsPage') : this.navCtrl.setRoot('EditProfilePage')
      })
      //this.navCtrl.setRoot('TabsPage');
    }else{
      this.toast.create({
        message: event.error.message,
        duration: 3000
      }).present();
    }
  }

}
