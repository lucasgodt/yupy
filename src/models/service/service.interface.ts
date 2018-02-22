import { Rating } from '../rating/rating.interface';
import { Profile } from '../profile/profile.interface';
import { Local } from '../local/local.interface'

export interface Service{
  $key?: string;
  description:string;
  local: Local;
  precoMedio: number;
  horarioServico:  TimeRanges;
  rating: Rating[];
  albumMedia?: any; //Muito importante
  profileId: string;
}
