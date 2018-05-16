import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditServicePage } from './edit-service';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EditServicePage,
  ],
  imports: [
    IonicPageModule.forChild(EditServicePage),
    ComponentsModule,
  ],
  exports: [
    EditServicePage,
  ]
})
export class MessagePageModule {}
