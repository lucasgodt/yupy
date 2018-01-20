import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewServicePage } from './new-service';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    NewServicePage,
  ],
  imports: [
    IonicPageModule.forChild(NewServicePage),
    ComponentsModule,
  ],
  exports: [
    NewServicePage,
  ]
})
export class MessagePageModule {}
