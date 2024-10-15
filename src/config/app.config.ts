import * as dotenv from 'dotenv';
dotenv.config();

// Load environment-specific variables based on NODE_ENV
if (process.env.NODE_ENV == 'dev') {
    dotenv.config({ path: '.env.dev', override: true });
} else {
    dotenv.config();
}

const getAppConfig = () => {

    const envValues = {
        port: parseInt(process.env.APP_PORT),
        minio_endpoint: process.env.MINIO_ENDPOINT,
        minio_access_key: process.env.MINIO_ACCESS_KEY,
        minio_secret_key: process.env.MINIO_SECRET_KEY,
        minio_bucket_name: process.env.MINIO_BUCKET_NAME,
        node_env: process.env.NODE_ENV,
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