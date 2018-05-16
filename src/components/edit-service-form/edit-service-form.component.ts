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
import { Camera , CameraOptions} from '@ionic-native/camera'
import { ImageProvider } from '../../providers/image/image.service';
/**
 * Generated class for the EditProfileFormComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-edit-service-form',
  templateUrl: 'edit-service-form.component.html'
})
export class EditServiceFormComponent implements OnInit, OnDestroy {

  private authenticatedUser$: Subscription;
  private authenticatedUser: User;

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  private images = [];

  categorieObs: Observable<any>;

  @Output() saveServiceResult: EventEmitter<Boolean>;

  @Input() profile: Profile;

  //categorieObs: Observable<Categorie>

  private categories: Categorie[];
  private categorie: Categorie;
  private service: Service;
  private selectedCategorie: Boolean;
  private categorieName: string;

  constructor(private toast: ToastController ,private auth: AuthService, private data: DataService, private navCtrl: NavController, private navParams: NavParams,private camera: Camera,private imageSrv: ImageProvider) {
    this.saveServiceResult = new EventEmitter<Boolean>();
    this.selectedCategorie = false;
    this.authenticatedUser$ = this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user
    })
  }

 selectCategorie(name: string){
   //CONSERTAR PARA PODER ADICIONAR CATEGORIAS SEM IR AO BANCO DE DADOS
    this.categorieObs = this.data.getCategorie(name);
      this.categorieObs.subscribe(snapshot => {
          this.categorie = snapshot;
          console.log("A categoria é: ",this.categorie);
          this.setCategorie(name);
      });
  }

  setCategorie(name: string){

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
      this.categorie = {} as Categorie;
      this.categorie.name = name;
      this.categorie.serviceList = [];
      this.data.setCategorie(this.categorie);
      this.selectedCategorie = true;
    }

  }

  async saveService(){
    //MODIFICAR PARA QUE O SERVICO SEJA SALVO DIRETO NA COLEÇÃO DO PROFILE E DA CATEGORIA PARA QUE O POSSA ACESSAR PELO SEU uid
    if(this.selectedCategorie){
      if(!this.profile.services){
        this.profile.services = [];
      }
      //this.profile.services.push(this.service);
      this.service.profileId = this.authenticatedUser.uid;
      this.service.$key = this.generateUUID();
      //this.categorie.serviceList.push(this.service);
      if(this.authenticatedUser){
        //DEVE EXISTIR UM SAVE SERVICE QUE SÓ RECEBE O PROFILE, A CATEGORIA E O SERVICO A SER SALVO
        //const resultProfile = await this.data.saveProfile(this.authenticatedUser, this.profile);
        //const resultCategorie = await this.data.saveCategorie(this.categorie);
        //const result = resultCategorie||resultCategorie;
        const result =  await this.data.saveService(this.profile,this.categorie,this.service)
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

  takePicture() {
    this.camera.getPicture(this.cameraOptions)
    .then(data => {
      let base64Image = 'data:image/jpeg;base64,' + data;
      return this.imageSrv.uploadImageToUser(base64Image, this.profile.$key);
    })
    .then(data => {
      this.images.push(data.a.name);
      localStorage.setItem('images', JSON.stringify(this.images));
    });
  }

  private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
  }



}
