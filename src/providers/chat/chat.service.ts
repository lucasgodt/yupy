import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
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

  constructor(private db: AngularFirestore, private auth: AuthService) {

  }

  async sendChat(message: Message){
    await this.db.collection<any>('/messages').add(message);
  }

  getChats(userTwoId: string){
    return this.auth.getAuthenticatedUser().map(auth => auth.uid)
        .mergeMap(uid => this.db.collection<any>(`/user-messages/${uid}/${userTwoId}`).valueChanges()) /*this.database.list(`/user-messages/${uid}/${userTwoId}`)*/
        .mergeMap(chats => {
          return Observable.forkJoin(
            chats.map(chat => this.db.doc<any>(`/messages/${chat.$key}`).valueChanges()
            .first()),
            (...vals: Message[]) => {
              return vals;
            }
          )
        })
  }

}
