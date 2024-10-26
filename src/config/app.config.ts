import * as dotenv from 'dotenv';
dotenv.config();

// Load environment-specific variables based on NODE_ENV
if (process.env.NODE_ENV == 'dev') {
    dotenv.config({ path: '.env.dev', override: true });
} else {
    dotenv.config();
}

const getAppConfig = () => {
    let env_path = process.env;

    const postgres_config = {
        POSTGRES_DB_HOST: env_path.POSTGRES_DB_HOST,
        POSTGRES_DB_PORT: parseInt(env_path.POSTGRES_DB_PORT),
        POSTGRES_DB_USERNAME: env_path.POSTGRES_DB_USERNAME,
        POSTGRES_DB_PASSWORD: env_path.POSTGRES_DB_PASSWORD,
        POSTGRES_DB_NAME: env_path.POSTGRES_DB_NAME,
    }

    const minio_config = {
        MINIO_ENDPOINT: env_path.MINIO_ENDPOINT,
        MINIO_ACCESS_KEY: env_path.MINIO_ACCESS_KEY,
        MINIO_SECRET_KEY: env_path.MINIO_SECRET_KEY,
        MINIO_BUCKET_NAME: env_path.MINIO_BUCKET_NAME,
    }

    const envValues = {

        APP_PORT: parseInt(env_path.APP_PORT),
        NODE_ENV: env_path.NODE_ENV,

        // minio/s3 configuration keys
        ...minio_config,

        // postgres data base configuration keys
        ...postgres_config
    }

    const keys = Object.keys(envValues);
    for (let key of keys) {
        const value = envValues[key];
        if (!value) {
            console.log(`${key} value must be specified!`);

        }
    }
    return envValues;
}



export const AppConfig = getAppConfig()