import { Component, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import {StorageService, Login} from '../services/storage.service';
import {Platform, ToastController, IonList, AlertController} from '@ionic/angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  logins: Login[] = [];

  newLogin: Login = <Login> {};

  @ViewChild('mylist')mylist: IonList;


// tslint:disable-next-line: max-line-length
  constructor(private storageService: StorageService, private plt: Platform, private toastController: ToastController, private alertController: AlertController) {
    this.plt.ready().then(() => {
      this.loadLogins();
    });
  }

  clearInput(){
  this.newLogin.appName = '';
  this.newLogin.login = '';
  this.newLogin.password = '';

}
  addLogin(){
    this.newLogin.modified =  Date.now();
    this.newLogin.id = Date.now();

    if (this.newLogin.appName==''||this.newLogin.appName== undefined){
      this.openAlert("Campo Nome App em branco!");
       
    }else if (this.newLogin.login==''||this.newLogin.login== undefined) {
      this.openAlert("Campo Login em branco!");
   
    } 
    else if (this.newLogin.password==''||this.newLogin.password== undefined)  {
      this.openAlert("Campo Senha em branco!");
   
    }
    else {
      this.storageService.addLogin(this.newLogin).then(login => {
        this.newLogin = <Login>{};
        this.showToast('Login adicionado!');
        this.loadLogins();
      });
    }
  }


  loadLogins(){
    this.storageService.getLogins().then(logins => {
      this.logins = logins;
    });
  }


  updateLogin(login: Login){
    login.appName = `UPDATED: ${ login.appName }`;
    login.modified = Date.now();
 
    this.storageService.updateLogin(login).then(login => {
       this.showToast('Login Atualizado!');
       this.mylist.closeSlidingItems();
       this.loadLogins();
    });
  }
 

  deleteLogin(login: Login){
    this.storageService.deleteLogin(login.id).then(login => {

       this.showToast('Login removido!');
       this.mylist.closeSlidingItems();
       this.loadLogins();
    });
  }

  async showToast(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  async openAlert(alertMensagem){
    const Alert = await this.alertController.create({
      header: 'Campo em branco',
      message: alertMensagem,
      buttons: ['OK']
    });
    Alert.present();
  }

}

