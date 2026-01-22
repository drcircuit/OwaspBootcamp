const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// CloudDeploy Platform data
const deployments = [
    { id: 1, name: 'web-api-prod', environment: 'production', status: 'running', instances: 3, region: 'us-east-1' },
    { id: 2, name: 'auth-service-prod', environment: 'production', status: 'running', instances: 2, region: 'us-east-1' },
    { id: 3, name: 'data-pipeline', environment: 'production', status: 'running', instances: 5, region: 'us-west-2' },
    { id: 4, name: 'analytics-dashboard', environment: 'staging', status: 'stopped', instances: 1, region: 'eu-west-1' }
];

const devOpsTeam = [
    { id: 1, name: 'Alex Chen', role: 'DevOps Lead', email: 'alex.chen@clouddeploy.io', access: 'admin' },
    { id: 2, name: 'Jordan Rivera', role: 'Platform Engineer', email: 'jordan@clouddeploy.io', access: 'read-write' },
    { id: 3, name: 'Sam Patel', role: 'SRE', email: 'sam@clouddeploy.io', access: 'read-only' }
];

// VULNERABLE configuration data - left exposed in production
const configData = {
    aws: {
        region: 'us-east-1',
        access_key_id: 'AKIAIOSFODNN7EXAMPLE',
        secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        s3_bucket: 'clouddeploy-prod-backups',
        account_id: '123456789012'
    },
    database: {
        host: 'prod-db-cluster.us-east-1.rds.amazonaws.com',
        port: 5432,
        username: 'db_admin',
        password: 'CloudD3pl0y!2024$PROD',
        database: 'customer_data'
    },
    stripe: {
        api_key: 'sk_live_51HvKj2LkdIyFiZACBmrE4WYDRqNH3tpAXmPLKeE',
        webhook_secret: 'whsec_CloudDeployProductionSecret2024'
    },
    secrets: {
        jwt_secret: 'prod-jwt-secret-DO-NOT-COMMIT-12345',
        encryption_key: 'aes-256-key-for-customer-pii-encryption',
        admin_api_token: 'Bearer cloudadmin_prod_token_xyz789abc'
    },
    datadog: {
        api_key: 'dd_api_key_1234567890abcdef',
        app_key: 'dd_app_key_abcdef1234567890'
    }
};

// VULNERABLE default credentials - never changed from deployment
const adminCredentials = {
    username: 'admin',
    password: 'CloudDeploy123!'
};

