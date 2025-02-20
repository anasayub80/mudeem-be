interface RegisterBody {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: 'user' | 'vendor' | 'admin';
}

interface RequestEmailTokenBody {
  email: string;
}

interface VerifyEmailTokenBody {
  email: string;
  emailVerificationToken: number;
}

interface LoginBody {
  email: string;
  password: string;
  firebaseToken: string;
}

interface ResetPasswordBody {
  email: string;
  password: string;
  passwordResetToken: number;
}

interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

interface RemoveSessionsBody {
  sessionIds: string[];
}

export {
  RegisterBody,
  RequestEmailTokenBody,
  VerifyEmailTokenBody,
  LoginBody,
  ResetPasswordBody,
  UpdatePasswordBody,
  RemoveSessionsBody
};
