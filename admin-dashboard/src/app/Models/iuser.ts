export interface IuserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  profilePicture?: string;
}

export interface Iuser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePicture?: string;
  phone?: string;
  address?: string;
  role?: 'customer' | 'admin';
  isActive?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  profile?: IuserProfile;
}
