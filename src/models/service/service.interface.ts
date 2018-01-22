import { Rating } from '../rating/rating.interface';
import { Profile } from '../profile/profile.interface';

export interface Service{
  $key?: string;
  description:string;
  local: string;
  precoMedio: number;
  horarioServico:  TimeRanges;
  rating: Rating[];
  albumMedia?: any; //Muito importante
  profileId: string;
}
