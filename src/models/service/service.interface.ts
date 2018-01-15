import { Rating } from '../rating/rating.interface';

export interface Service{
  description:string;
  local: string;
  price: number;
  time:  TimeRanges;
  rating: Rating[];
  albumMedia?: any;
}
