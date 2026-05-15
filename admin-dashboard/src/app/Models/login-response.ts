import { Iuser } from './iuser';

export interface LoginResponse {
  token: string;
  user: Iuser;
}
