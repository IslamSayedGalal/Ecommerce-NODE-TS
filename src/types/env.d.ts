declare namespace NodeJS {
    export interface ProcessEnv {
      PORT: number;
      DB_URL: string;
      DB_NAME: string;
      NODE_ENV: "dev" | "prod";
      BCRYPT_SALT: number;
      APP_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      GUEST_PASSWORD: string;
      BUCKET_NAME: string;
      REGION: string;
      ACCESS_KEY: string;
      SECRET_ACCESS_KEY: string;
    }
  }