import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile/profile.interface';
import * as firebase from 'firebase';
import { Service } from '../../models/service/service.interface';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ImageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ImageProvider {

  private profileDoc: AngularFirestoreDocument<Profile>;
  profileObject: Observable<Profile>;

  private profilesCollection: AngularFirestoreCollection<Profile>;
  profileList: Observable<Profile[]>;

  private servicesCollection: AngularFirestoreCollection<Service>;
  serviceList: Observable<Service[]>;

  constructor(private db: AngularFirestore ,private authService: AuthService) {
  }

  uploadImageToUserService(image: string, userId: string, serviceId: string): any {
    let storageRef = firebase.storage().ref();
    let imageName = this.generateUUID();
    let imageRef = storageRef.child(`${userId}/${serviceId}/${imageName}.jpg`);
    return imageRef.putString(image, 'data_url');
  }

  uploadImageToUser(image: string, userId: string): any {
    let storageRef = firebase.storage().ref();
    let imageName = this.generateUUID();
    let imageRef = storageRef.child(`${userId}/${imageName}.jpg`);
    return imageRef.putString(image, 'data_url');
  }

  getImage(userId: string, imageId: string): any {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child(`${userId}/${imageId}`);
      return imageRef.getDownloadURL();
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
