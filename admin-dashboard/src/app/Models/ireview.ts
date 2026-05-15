export interface Ireview {
  _id?: string;
  user: string | { name: string }; 
  name: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
