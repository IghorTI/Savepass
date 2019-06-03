import { Component, OnInit, ViewChild } from '@angular/core';
import {StorageService, Login} from '../services/storage.service';
import {Platform, ToastController, IonList, AlertController} from '@ionic/angular';


@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})

export class ListPage {
 
  logins: Login[];

  newLogin: Login = <Login> {};

  @ViewChild('mylist')mylist: IonList;
  updatelogins: Login[] = [];

  constructor(private storageService: StorageService, private plt: Platform, private toastController: ToastController,private alertController: AlertController) {
      this.plt.ready().then(() => {
        this.loadLogins();
      });
    }

    loadLogins(){
      this.storageService.getLogins().then(logins => {
        this.logins = logins;
      });
    }
    updateLogin(login: Login){
  
      
      
      console.log( login.appName,login.login,login.password);

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
    async openDeleteAlert(login: Login){
      const deleteLoginAlert = await this.alertController.create({
        header: 'Deletar Login',
        message: 'Deseja deletar esse Login?',
        buttons: [{
          text: 'Cancel',
        },
        {
          text: 'Deletar',
          handler: () => {
            this.deleteLogin(login);
          }
        }]
      });
      deleteLoginAlert.present();
    }

    async showToast(msg) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 2000
      });
      toast.present();
    }

    async presentAlertPrompt(login: Login) {
  

      const alertTeste =  await this.alertController.create({
        header: 'Atualizar Login!',
        inputs: [
          {
            
            name:'appName',
            placeholder: 'App',
            value: login.appName
          },{
           
            name: 'loginUser',
            placeholder: 'Login',
            value: login.login
          },{
          
            name: 'passwordUser',
            placeholder: 'Senha',
            value: login.password
          }],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Update',
            handler: (alertData) => {

              login.appName = alertData.appName;
              login.login = alertData.loginUser;
              login.password = alertData.passwordUser;
              login.modified = Date.now();

              this.updateLogin(login);
            }
          }
        ]
      });
      alertTeste.present();
    }
  }



