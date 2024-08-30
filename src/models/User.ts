import { ObjectId } from 'mongodb';

export interface User {
  id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  emailVerificationToken: string;
}
