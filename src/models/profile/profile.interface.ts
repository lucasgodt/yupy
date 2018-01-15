import { Need } from "../need/need.interface";
import { Service } from "../service/service.interface";
import { Rating } from '../rating/rating.interface';

export interface Profile {
  firstName: string;
  lastName: string;
  local: string;            //Filtragem colaborativa
  description:string;       //Filtragem colaborativa
  email: string;
  ratings: Rating[];
  avatar: ImageBitmap;
  needs: Need[];//Buscas    //Filtragem colaborativa
  solvedNeeds: Need[];      //Filtragem colaborativa
  friendsList?: Profile[];  //Filtragem colaborativa
  albumMedia: any;          //Filtragem colaborativa
  $key?: string;
  services: Service[];     //Filtragem de conteúdo
  online: boolean;         //Filtragem de conteúdo
  responseTime: TimeRanges;   //Filtragem de conteúdo
}
