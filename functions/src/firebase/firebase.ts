import * as _functions from "firebase-functions";
import * as admin from "firebase-admin";


/**
 * Wrapper file around firebase's SDK
 */

// The Firebase Admin SDK to access Cloud Firestore.
export const app = admin.initializeApp();



/**
 * initiated app's features
 */
// database
export const firestore = admin.firestore();
// messaging
export const messaging = admin.messaging();
export const functions = _functions;