import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from '../../providers/data/data.service';
import { Profile } from '../../models/profile/profile.interface';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the OnlineUsersComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-online-users',
  templateUrl: 'online-users.component.html'
})
export class OnlineUsersComponent implements OnInit{

  userList: Observable<Profile[]>;

  constructor(private navCtrl: NavController, private data: DataService) {

  }

  ngOnInit(){
    this.setUserOnline();
    this.getOnlineUsers();
  }

  setUserOnline(){
    this.data.getAuthenticatedUserProfile().subscribe(profile =>{
      //Coloca o usuário online no firebase
      this.data.setUserOnline(profile);
    });
  }

  getOnlineUsers(){
    this.userList = this.data.getOnlineUsers();
  }

  openChat(profile: Profile){
    this.navCtrl.push('MessagePage',{profile});
  }
}
