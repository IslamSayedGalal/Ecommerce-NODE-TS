export interface RegisterInterface {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginInterface {
  username: string;
  password: string;
}

export interface ForgetPasswordInterface {
  username: string;
}

export interface VerifyPasswordResetCodeInterface {
  resetCode: string;
}

export interface ResetPasswordInterface {
  username: string;
  newPassword: string;
}
