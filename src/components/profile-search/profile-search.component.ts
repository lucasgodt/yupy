import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../providers/data/data.service';
import { Profile } from '../../models/profile/profile.interface';
import { Service } from '../../models/service/service.interface';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';
import { Need } from '../../models/need/need.interface';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Categorie } from '../../models/categorie/categorie.interface';

/**
 * Generated class for the ProfileSearchComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-profile-search',
  templateUrl: 'profile-search.component.html'
})
export class ProfileSearchComponent implements OnInit, OnDestroy {

  query: string;

  serviceList: Service[]

  categorieObs: FirebaseObjectObservable<any>;

  categorie: Categorie;

  private authenticatedUser$: Subscription;
  private authenticatedUser: User;

  userProfile: Profile;

  profileObserver: FirebaseObjectObservable<any>;

  @Output() selectedProfile: EventEmitter<Profile>;

  constructor(private data: DataService, private auth: AuthService) {
    this.selectedProfile = new EventEmitter<Profile>();
    this.authenticatedUser$ = this.auth.getAuthenticatedUser().subscribe((user: User) => {
      this.authenticatedUser = user
    })

  }

  async saveProfile(profile: Profile){
    if(this.authenticatedUser){
    const result = await this.data.saveProfile(this.authenticatedUser, profile);
    }
  }

  selectProfile(service: Service){
    this.profileObserver = this.data.searchProfile(service.profileId);

    this.profileObserver.subscribe(snapshot => {
      this.userProfile = snapshot.val();
      this.userProfile.$key = service.profileId;
      this.selectedProfile.emit(this.userProfile);
    });
  }

  searchService(query: string){

  }

  updateProfileList(name: string){

    this.categorieObs = this.data.getCategorie(name);

    this.categorieObs.subscribe(snapshot => {
        this.categorie = snapshot.val();
        this.serviceList = this.categorie.serviceList;
        console.log("Os serviços desta categoria são: ",this.serviceList);
    });


  }

  ngOnInit(): void{

  }

  ngOnDestroy(): void{
    this.authenticatedUser$.unsubscribe();
  }

}
