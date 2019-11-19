import * as dotenv from "dotenv";
import * as Joi from "@hapi/joi";
import * as fs from "fs";

export type EnvConfig = Record<string, string>;

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),
      PORT: Joi.number().default(3001),
      HOST: Joi.string().default("0.0.0.0"),
      API_AUTH_ENABLED: Joi.boolean().required(),
      REDIS_PREFIX: Joi.string().default("ra-web-git").required(),
      REDIS_HOST: Joi.string().default("web-dev.aws.rapidaddition.net").required(),
      REDIS_PORT: Joi.number().default(6379).required(),
      REDIS_DB: Joi.number().default(1).required(),
      AUTH_TYPE: Joi.string().default("dummy"),
      REPOSITORY_BASE_PATH: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get host(): string {
    return this.envConfig.HOST;
  }

  get basePath(): string {
    return this.envConfig.REPOSITORY_BASE_PATH;
  }

  get isApiAuthEnabled(): boolean {
    return Boolean(this.envConfig.API_AUTH_ENABLED);
  }
}
