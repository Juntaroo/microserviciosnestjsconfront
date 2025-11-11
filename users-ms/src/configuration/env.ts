import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

interface EnvVars {
  DATABASE_URL: string;
  HOST: string;
  PORT: number;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    HOST: joi.string().required(),
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true)
  .prefs({ convert: true });

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  DATABASE_URL: envVars.DATABASE_URL,
  HOST: envVars.HOST,
  PORT: envVars.PORT,
  JWT_SECRET: envVars.JWT_SECRET,
};
