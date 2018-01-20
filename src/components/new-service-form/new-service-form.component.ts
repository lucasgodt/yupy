import { Component, OnDestroy, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile/profile.interface';
import { Categorie } from '../../models/categorie/categorie.interface';
import { Service } from '../../models/service/service.interface';
import { DataService } from '../../providers/data/data.service';
import { AuthService } from '../../providers/auth/auth.service';
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
  private selectCategorie$: Subscription;
  private authenticatedUser: User;

  @Output() saveServiceResult: EventEmitter<Boolean>;

  @Input() profile: Profile;

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

    this.selectCategorie$ = this.data.getCategorie(name).subscribe(categorie => {
        this.categorie = categorie;
        console.log(this.categorie);
    });

    if(this.categorie){
      this.selectedCategorie = true;
    }else{
      this.toast.create({
              message: "Categoria inexistente, criando categoria...",
              duration: 3000
            }).present();;
      this.categorie.name = this.categorieName;
      this.categorie.serviceList = [];
      this.data.setCategorie(this.categorie);
    }

  }

  async saveService(){

    if(this.selectedCategorie){
      this.profile.services.push(this.service);
      this.service.profile = this.profile;
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
    this.selectCategorie$.unsubscribe();
  }

}
