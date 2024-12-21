export interface LoginData {
    email: string;
    password: string;
    loginType?: string;
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    role?: string,
    first_name:string,
    last_name: string,
    msisdn: string
      
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      name: string;
      email: string;
    };
  }
  