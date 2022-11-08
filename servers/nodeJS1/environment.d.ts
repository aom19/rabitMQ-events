declare global {
    namespace NodeJS {
        interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        DB_USER:string;
        DB_HOST:string;
        DB_DATABASE:string;
        DB_PORT:number;
        DB_PASSWORD: string;
        SERVER_PORT: string;
        RABITMQ_NAME:string;
        RABITMQ_PORT:string;
        RABITMQ_USER:string;
        RABITMQ_PASSWORD:string;
      }
    }}
  
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}