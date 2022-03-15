import {Role} from "./role";

export class User {
  id: number | string;
  img: string;
  username: string;
  password: string;
  firstName: string;
  gender: 'male' | 'female' | 'other';
  lastName: string;
  role: Role;
  token: string;
}
