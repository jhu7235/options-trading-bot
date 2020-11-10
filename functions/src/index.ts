import { functions } from './firebase/firebase';
import { createServer } from './http/http';
import { openOptions } from './triggers/triggers';

// TODO: implement stricter linting rules

/**
 * Open options
 */
exports.openOptions = functions.region('us-central1').pubsub.topic('open-options').onPublish(openOptions);

exports.api = functions.https.onRequest(createServer());

