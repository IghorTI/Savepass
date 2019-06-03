import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


export interface Login{
  id: number,
  appName: string,
  login: string,
  password: string,
  modified: number
}

//const ITEMS_KEY = 'my-items';
const LOGINS_KEY = 'my-logins';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(private storage: Storage) { }

   //Create
   addLogin(login: Login): Promise<any> {
    return this.storage.get(LOGINS_KEY).then((logins:Login[])=>{
      if(logins){
        logins.push(login)
        return this.storage.set(LOGINS_KEY, logins);
      } else {
        return this.storage.set(LOGINS_KEY, [login]);
      }
    });
  }

  //Read
  getLogins(): Promise<Login[]>{
    return this.storage.get(LOGINS_KEY);
  }

   //Update
   updateLogin(login: Login): Promise<any>{
    return this.storage.get(LOGINS_KEY).then((logins:Login[])=>{
      if(!logins || logins.length === 0){
        return null;
      }
      let newLogins: Login[] = [];

      for (let i of logins) {
        if(i.id === login.id){
          newLogins.push(login);
        }else{
          newLogins.push(i);
        }
      }
      return this.storage.set(LOGINS_KEY, newLogins);
    });
  }


    //Delete
    deleteLogin(id: number): Promise<Login>{
      return this.storage.get(LOGINS_KEY).then((logins: Login[]) => {
        if(!logins || logins.length === 0) {
          return null;
        }
        let toKeep: Login[] = [];
        for (let i of logins) {
         if (i.id !== id) {
           toKeep.push(i);
         }
        }
        return this.storage.set(LOGINS_KEY, toKeep);
      });
    }

}
