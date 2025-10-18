export interface AuthLoginModel {
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthLoginDTO {
  email: string;
  password: string;
}

export interface AuthRegisterDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface PayloadToken {
  userId: string;
}
