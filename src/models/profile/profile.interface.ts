import { Service } from "../service/service.interface";
import { Rating } from '../rating/rating.interface';

export interface Profile {
  firstName: string;
  lastName: string;
  local: string;            //Filtragem colaborativa
  description:string;       //Filtragem colaborativa
  email: string;
  ratings: Rating[];
  avatar: ImageBitmap;      //Filtragem colaborativa
  clientsList?: Profile[];  //Filtragem colaborativa
  albumMedia: any;          //Filtragem colaborativa
  $key?: string;
  service: Service[];
  online: boolean;         //Filtragem de conteúdo
  responseTime: TimeRanges;   //Filtragem de conteúdo
}
