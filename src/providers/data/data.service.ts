import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { User } from 'firebase/app';
import { database } from 'firebase';
import { Profile } from '../../models/profile/profile.interface';
import { AuthService } from '../auth/auth.service';
import { ElasticSearch } from '../../models/elastic/elastic.interface';
import "rxjs/add/operator/take";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataService {

  profileObject: FirebaseObjectObservable<Profile>

  elasticObject: FirebaseObjectObservable<ElasticSearch>

  profileList: FirebaseListObservable<Profile>;

  constructor(private authService: AuthService, private database: AngularFireDatabase) {
  }

  //teste de busca pelo elasticSearch
  async searchProfile(query: string){

    const elasticSearch = {
      "q": query
    };

    this.elasticObject = this.database.object(`/search/request/`);

    try{
      await this.elasticObject.set(elasticSearch);
      return this.elasticObject;
    }catch(e){
      console.error(e);
      return this.elasticObject;
    }
  }

  searchUser(need: string){
    const query = this.database.list('/profiles',{
      query: {
        //AQUI EU FAÇO A BUSCA E ORDENO, DEVO ORDENAR DE ACORDO COM A ESCOLHA DO USUÁRIO
        orderByChild: 'firstName',
        equalTo: need
      }
    })

    return query;
  }

  getAuthenticatedUserProfile(){
    return this.authService.getAuthenticatedUser().map(user => user.uid).mergeMap(authId => this.database.object(`profiles/${authId}`)).take(1);
  }

  getProfile(user: User){
    this.profileObject = this.database.object(`/profiles/${user.uid}`, { preserveSnapshot: true });

    return this.profileObject.take(1);
  }

  setUserOnline(profile: Profile){
    const ref = database().ref(`online-users/${profile.$key}`);

    try {
      ref.update({ ...profile });
      ref.onDisconnect().remove();
    }catch(e){
      console.error(e);
    }
  }

  getOnlineUsers(): FirebaseListObservable<Profile[]>{
    return this.database.list(`online-users`);
  }

  async saveProfile(user: User, profile: Profile){
    this.profileObject = this.database.object(`/profiles/${user.uid}`);

    try{
      await this.profileObject.set(profile);
      return true;
    }catch(e){
      console.error(e);
      return false;
    }
  }

}
