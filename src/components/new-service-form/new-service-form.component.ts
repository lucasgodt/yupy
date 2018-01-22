import { Component, OnDestroy, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile/profile.interface';
import { Categorie } from '../../models/categorie/categorie.interface';
import { Service } from '../../models/service/service.interface';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { FirebaseObjectObservable } from 'angularfire2/database';
/**
 * Generated class for the EditProfileFormComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-new-service-form',
  templateUrl: 'new-service-form.component.html'
})
export class NewServiceFormComponent implements OnInit, OnDestroy {

  private authenticatedUser$: Subscription;
  private authenticatedUser: User;

  categorieObs: FirebaseObjectObservable<any>;

  @Output() saveServiceResult: EventEmitter<Boolean>;

  @Input() profile: Profile;

  //categorieObs: Observable<Categorie>

  private categories: Categorie[];
  private categorie: Categorie;
  private service: Service;
  private selectedCategorie: Boolean;
  private categorieName: string;

  constructor(private toast: ToastController ,private auth: AuthService, private data: DataService, private navCtrl: NavController, private navParams: NavParams) {
    this.saveServiceResult = new EventEmitter<Boolean>();
    this.selectedCategorie = false;
    this.authenticatedUser$ = this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user
    })
  }

 selectCategorie(name: string){

    this.categorieObs = this.data.getCategorie(name);

    this.categorieObs.subscribe(snapshot => {
        this.categorie = snapshot.val();
        console.log("A categoria é: ",this.categorie);
        this.checkCategorie(name);
    });

  }

  checkCategorie(name: string){

    if(this.categorie.name){
      console.log("Categoria Selecionada");
      this.selectedCategorie = true;
      if(!this.categorie.serviceList){
        this.categorie.serviceList = [];
      }
    }else{
      console.log("Categoria inexistente");
      this.toast.create({
              message: "Categoria inexistente, criando categoria...",
              duration: 3000
            }).present();
      console.log("DANDO PAU AQUI");
      this.categorie.name = name;
      console.log("TESTE");
      this.categorie.serviceList = [];
      this.data.setCategorie(this.categorie);
      this.selectedCategorie = true;
    }

  }

  async saveService(){

    if(this.selectedCategorie){

      //services do profile está sendo instanciado novamente


      this.profile.services.push(this.service);
      this.service.profileId = this.profile.$key;
      this.categorie.serviceList.push(this.service);
      if(this.authenticatedUser){
        const resultProfile = await this.data.saveProfile(this.authenticatedUser, this.profile);
        const resultCategorie = await this.data.saveCategorie(this.categorie);
        const result = resultCategorie||resultCategorie;
        this.saveServiceResult.emit(result);
      }
    }else{
      this.saveServiceResult.emit(false);
    }
  }

  ngOnInit(): void{
    if(!this.profile){
      this.profile = {} as Profile;
    }
    if(!this.categorie){
      this.categorie = {} as Categorie;
    }
    if(!this.service){
      this.service = {} as Service;
    }
  }

  ngOnDestroy(): void{
    this.authenticatedUser$.unsubscribe();
  }

}
