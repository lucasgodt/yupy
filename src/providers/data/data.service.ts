import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Categorie } from "../../models/categorie/categorie.interface";
import { User } from 'firebase/app';
import { database } from 'firebase';
import { Profile } from '../../models/profile/profile.interface';
import { Service } from '../../models/service/service.interface';
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

  categorieObject: FirebaseObjectObservable<Categorie>

  profileObject: FirebaseObjectObservable<Profile>

  elasticObject: FirebaseObjectObservable<ElasticSearch>

  profileList: FirebaseListObservable<Profile>;

  constructor(private authService: AuthService, private database: AngularFireDatabase) {
  }

  //teste de busca pelo elasticSearch
  async searchProfile(query: string){

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
  //Captura uma categoria inteira e sua lista de usuários
  getCategories(){
    return this.database.list(`categories`);
  }
  //captura só a lista de usuários
  getCategorieServices(categorieName:string): FirebaseListObservable<Service[]>{
    return this.database.list(`/categories/${categorieName}/serviceList`);
  }
  //Captura uma categoria inteira e sua lista de usuários
  getCategorie(categorieName:string){
    this.categorieObject = this.database.object(`/categories/${categorieName}`, { preserveSnapshot: true });
    console.log("Objeto:");
    console.log(this.categorieObject.take(1));
    return this.categorieObject.take(1);
  }
  //cria uma nova categoria
  async setCategorie(categorie: Categorie){
    //await this.database.list('/categories').push(categorie);
    const categorieRef = database().ref(`/categories/`+categorie.name+`/`);
    await categorieRef.set(categorie)
  }
  //Salva a categoria
  async saveCategorie(categorie: Categorie){
    this.categorieObject = this.database.object(`/categories/${categorie.name}`);

    try {
      await this.categorieObject.set(categorie);
      return true;
    }catch(e){
      console.error(e);
      return false;
    }

  }

}
