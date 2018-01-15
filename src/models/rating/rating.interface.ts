import { Service } from '../service/service.interface';
import { Profile } from '../profile/profile.interface';

export interface Rating{
  profileThatRated: Profile;
  rating: number;
  valuation: string;
  service: Service;
  solved: Boolean;
}
