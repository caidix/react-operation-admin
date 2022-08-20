export interface ILoginReq {
  name: string;
  password: string;
}

export interface IEmailVerifyCodeReq {
  email: string;
}

export interface IRegisterReq {
  name: string;
  password: string;
  email: string;
  verifyCode: string;
}
