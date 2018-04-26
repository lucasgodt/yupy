import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Categorie } from "../../models/categorie/categorie.interface";
import { User } from 'firebase/app';
import { database } from 'firebase';
import { Profile } from '../../models/profile/profile.interface';
import { Service } from '../../models/service/service.interface';
import { AuthService } from '../auth/auth.service';
import { ElasticSearch } from '../../models/elastic/elastic.interface';
import { Observable } from 'rxjs/Observable';
//import "rxjs/add/operator/take";
//import "rxjs/add/operator/map";
//import "rxjs/add/operator/mergeMap";

/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataService {

  private profileDoc: AngularFirestoreDocument<Profile>;
  profileObject: Observable<Profile>;

  private serviceDoc: AngularFirestoreDocument<Service>;
  serviceObject: Observable<Service>;

  private categorieDoc: AngularFirestoreDocument<Categorie>;
  categorieObject: Observable<Categorie>;

  private profilesCollection: AngularFirestoreCollection<Profile>;
  profileList: Observable<Profile[]>;

  private servicesCollection: AngularFirestoreCollection<Service>;
  serviceList: Observable<Service[]>;

  //categorieObject: FirebaseObjectObservable<Categorie>

  //profileObject: FirebaseObjectObservable<Profile>

  //profileList: FirebaseListObservable<Profile>;

  constructor(private db: AngularFirestore ,private authService: AuthService, private database: AngularFireDatabase) {
  }

  searchUser(uid: string){
    /*const query = this.database.list('/profiles',{
      query: {
        //AQUI EU FAÇO A BUSCA E ORDENO, DEVO ORDENAR DE ACORDO COM A ESCOLHA DO USUÁRIO
        orderByChild: '$key',
        equalTo: uid
      }
    })

    return query;*/
  }

  searchProfile(profileID: string){
    this.profileDoc = this.db.doc<Profile>(`/profiles/${profileID}`);
    this.profileObject = this.profileDoc.valueChanges();
    //this.profileDoc = this.database.object(`/profiles/${profileID}`, { preserveSnapshot: true });
    return this.profileObject;
  }

  getAuthenticatedUserProfile(){
    return this.authService.getAuthenticatedUser().map(user => user.uid).mergeMap(authId =>
      this.db.doc<Profile>(`profiles/${authId}`).valueChanges()
    ).first();
  }

  getProfile(user: User){
    /*this.profileObject = this.database.object(`/profiles/${user.uid}`, { preserveSnapshot: true });
    return this.profileObject.take(1);*/
    this.profileDoc = this.db.doc<Profile>(`/profiles/${user.uid}`);
    this.profileObject = this.profileDoc.valueChanges();
    //this.profileDoc = this.database.object(`/profiles/${profileID}`, { preserveSnapshot: true });
    return this.profileObject;
  }

  getServiceList(categorieName: string){
    this.servicesCollection = this.db.collection("categories").doc<Categorie>(`/${categorieName}/`).collection<Service>(`serviceList`);
    this.serviceList = this.servicesCollection.valueChanges();
    return this.serviceList;
  }

  getUserServiceList(profile: Profile){
    this.servicesCollection = this.db.collection("profiles").doc(`${profile.$key}`).collection("services");
    this.serviceList = this.servicesCollection.valueChanges();
    return this.serviceList;
  }

  //MODIFICAR PARA O NOVO DATABASE
  setUserOnline(profile: Profile){
    const ref = database().ref(`online-users/${profile.$key}`);

    try {
      ref.update({ ...profile });
      ref.onDisconnect().remove();
    }catch(e){
      console.error(e);
    }
  }

  getOnlineUsers(){
    this.profilesCollection = this.db.collection<Profile>('online-users');
    this.profileList = this.profilesCollection.valueChanges();
    return this.profileList;
  }

  async saveService(profile: Profile,categorie: Categorie, service: Service){
    this.serviceDoc = this.db.doc<Service>(`/profiles/${profile.$key}/services/${service.$key}`);
    try{
      await this.serviceDoc.set(service);
      this.serviceDoc = this.db.doc<Service>(`/categories/${categorie.name}/serviceList/${service.$key}`);
      try{
        await this.serviceDoc.set(service);
        return true;
      }catch(e){
        console.error(e);
        return false;
      }
    }catch(e){
      console.error(e);
      return false;
    }
  }

  //MODIFICAR PARA O NOVO DATABASE
  async saveProfile(user: User, profile: Profile){
    //this.profileObject = this.database.object(`/profiles/${user.uid}`);
    this.profileDoc = this.db.doc<Profile>(`/profiles/${user.uid}`);

    try{
      console.log("Set profile:")
      console.log(profile)
      await this.profileDoc.set(profile);
      return true;
    }catch(e){
      console.error(e);
      return false;
    }
  }
  //Captura uma categoria inteira e sua lista de usuários
  //MODIFICAR PARA O NOVO DATABASE
  getCategories(){
    return this.database.list(`categories`);
  }
  //captura só a lista de usuários
  getCategorieServices(categorieName:string){
    this.servicesCollection = this.db.collection<Service>(`/categories/${categorieName}/serviceList`);
    this.serviceList = this.servicesCollection.valueChanges();
    return this.serviceList;
  }
  //Captura uma categoria inteira e sua lista de usuários
  getCategorie(categorieName:string){
    this.categorieDoc = this.db.doc<Categorie>(`/categories/${categorieName}`);
    this.categorieObject = this.categorieDoc.valueChanges();
    return this.categorieObject;
  }
  //cria uma nova categoria
  //MODIFICAR PARA O NOVO DATABASE
  async setCategorie(categorie: Categorie){
    //MODIFICAR PARA O NOVO DATABASE
    //await this.database.list('/categories').push(categorie);
    this.categorieDoc = this.db.doc<Categorie>(`/categories/${categorie.name}`);
    try{
      await this.categorieDoc.set(categorie);
      return true
    }catch(e){
      console.error(e);
      return false;
    }
  }
  //Salva a categoria
  //MODIFICAR PARA O NOVO DATABASE
  async saveCategorie(categorie: Categorie){
    this.categorieDoc = this.db.doc<Categorie>(`/categories/${categorie.name}`);

    try {
      console.log("Set categorie:")
      console.log(categorie)
      await this.categorieDoc.set(categorie);
      return true;
    }catch(e){
      console.error(e);
      return false;
    }

  }

}
