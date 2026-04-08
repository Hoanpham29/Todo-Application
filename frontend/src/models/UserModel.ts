export class UserModel {
  id: number;
  email: string;
  fullName: string;
  authorities: { authority: string }[];

  constructor(id: number, email: string, fullName: string, authorities: { authority: string }[]){
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.authorities = authorities;
    }
}