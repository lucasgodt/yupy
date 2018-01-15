import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Message } from '../../models/messages/message.interface';
import { AuthService } from '../auth/auth.service';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ChatService {

  constructor(private database: AngularFireDatabase, private auth: AuthService) {

  }

  async sendChat(message: Message){
    await this.database.list('/messages').push(message);
  }

  getChats(userTwoId: string){
    return this.auth.getAuthenticatedUser().map(auth => auth.uid)
        .mergeMap(uid => this.database.list(`/user-messages/${uid}/${userTwoId}`))
        .mergeMap(chats => {
          return Observable.forkJoin(
            chats.map(chat => this.database.object(`/messages/${chat.$key}`)
            .first()),
            (...vals: Message[]) => {
              return vals;
            }
          )
        })
  }

}
