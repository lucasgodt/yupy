import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginResponse } from '../../models/login/login-response.interface';
import { AuthService } from '../../providers/auth/auth.service';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(private auth: AuthService, private navCtrl: NavController, private navParams: NavParams, private toast: ToastController) {
  }

  register(event){
    if(!event.error){
      this.toast.create({
        message:"Conta criada: "+ event.result.email,
        duration: 3000
      }).present();
      //this.navCtrl.setRoot('EditProfilePage'); SignOut
        this.auth.signOut();
        this.navCtrl.setRoot('LoginPage');
    }else{
      this.toast.create({
        message:"Conta não criada: "+ event.error.message,
        duration: 3000
      }).present();
    }
  }

}
