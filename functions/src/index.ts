import { functions } from './firebase/firebase';
import { openOptions } from './triggers/triggers';

// TODO: implement stricter linting rules

/**
 * Syncs travel regulations from iata source.
 * Triggered by pubsub (https://console.cloud.google.com/cloudscheduler?project=covid-border)
 * locally served at http://localhost:5034/covid-border/us-central1/syncTravelRegulations
 */
exports.syncTravelRegulations = functions.region('us-central1').pubsub.topic('open-options').onPublish(openOptions)

