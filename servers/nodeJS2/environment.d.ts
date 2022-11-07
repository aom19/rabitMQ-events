declare global {
    namespace NodeJS {
        interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        MONGO_NAME:string;
        MONGO_PORT:string;
        MONGO_USER:string;
        MONGO_PASSWORD: string;
        SERVER_PORT: string;
        RABITMQ_NAME:string ;
        RABITMQ_PORT:number;
        RABITMQ_USER:string;
        RABITMQ_PASSWORD:string;
      }
    }}
  
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}