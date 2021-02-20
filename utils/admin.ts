import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY!))
    });
}

export default admin;
