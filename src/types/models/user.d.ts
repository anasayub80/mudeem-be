import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'vendor';
  phone: string;
  username: string;
  emailVerified: boolean;
  emailVerificationToken?: number | null;
  emailVerificationTokenExpires?: Date | null;
  passwordResetToken?: number | null;
  passwordResetTokenExpires?: Date | null;
  greenPoints: number;
  isActive: boolean;
  adminApproved: boolean;
  getJWTToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export interface UserSession extends Document {
  _id: string;
  expires: Date;
  session: {
    cookie: {
      originalMaxAge: number | null;
      partitioned: boolean | null;
      priority: string | null;
      expires: Date | null;
      secure: boolean | null;
      httpOnly: boolean;
      domain: string | null;
      path: string;
      sameSite: string | null;
    };
    passport: {
      user: string;
    };
    deviceInfo: {
      browser: string;
      version: string;
      os: string;
    };
    lastActive: Date;
  };
}

export interface IAddress extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface IEvent extends Document {
  name: string;
  description: string;
  dateTime: Date;
}
