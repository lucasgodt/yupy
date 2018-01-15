import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';
import { Observable } from 'rxjs/Observable';
import { Message } from '../../models/messages/message.interface';
import { AuthService } from '../../providers/auth/auth.service';
import { DataService } from '../../providers/data/data.service';
import { ChatService } from '../../providers/chat/chat.service';
/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  selectedProfile: Profile;

  messageList: Observable<Message[]>;

  userId: string;
  userProfile: Profile;

  constructor(private chat: ChatService, private auth: AuthService, private data: DataService, private navParams: NavParams) {

  }

  ionViewWillLoad() {
    this.selectedProfile = this.navParams.get('profile');
    this.data.getAuthenticatedUserProfile().subscribe(profile =>{
      this.userProfile = profile;
      this.userId = profile.$key;
    })

    this.messageList = this.chat.getChats(this.selectedProfile.$key);


   }

   async sendMessage(content: string){
     try{

       const message: Message = {
         userToId: this.selectedProfile.$key,
         userToProfile:{
           name: this.selectedProfile.firstName,
           //avatar: this.selectedProfile.avatar
         },
         userFromProfile:{
           name: this.userProfile.firstName,
           //avatar: this.userProfile.avatar
         },
         userFromId: this.userId,
         content: content
       }

       await this.chat.sendChat(message);

     }catch(e){
       console.error(e);
     }
   }

}
