import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';

/**
 * Generated class for the TabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1root: string;
  tab2root: string;
  tab3root: string;

  constructor(private auth: AuthService, private navCtrl: NavController) {

    this.tab1root = 'SearchPage';
    this.tab2root = 'InboxPage';
    this.tab3root = 'ProfilePage';

  }

  signOut(){
    this.auth.signOut();
    this.navCtrl.setRoot('LoginPage');
  }

}
