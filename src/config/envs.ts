

import 'dotenv/config';
import * as joi from 'joi';
import { hostname } from 'os';

interface EnvVars {
    PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT: number;
    ENTORNO: string;
    HOST_API: string;
    SECRET_JWT: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    ENTORNO: joi.string().required(),
    HOST_API: joi.string().required(),
    SECRET_JWT: joi.string().required(),
    
})
.unknown( true );

const { error, value } = envsSchema.validate( process.env );

if ( error ) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    dbUser: envVars.DB_USER,
    dbPassword: envVars.DB_PASSWORD,
    dbName: envVars.DB_NAME,
    dbHost: envVars.DB_HOST,
    dePort: envVars.DB_PORT,
    deEntorno: envVars.ENTORNO,
    hostApi: envVars.HOST_API,
    secretJwt: envVars.SECRET_JWT,
}