import { Service } from "../service/service.interface";

export interface Categorie {
  name: string;
  $key?: string;
  description: string;       //Filtragem colaborativa
  serviceList: Service[];  //Filtragem colaborativa
}
