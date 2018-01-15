import { Profile } from '../profile/profile.interface';

export interface Message {
  userFromId: string;
  userFromProfile:{
    name: string;
    //avatar: string;
  }
  userToId: string;
  userToProfile:{
    name: string;
    //avatar: string;
  }
  content: string;
}
