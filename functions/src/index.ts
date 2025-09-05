//Replit Version
// /**
//  * Import function triggers from their respective submodules:
//  *
//  * import {onCall} from "firebase-functions/v2/https";
//  * import {onDocumentWritten} from "firebase-functions/v2/firestore";
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// // For cost control, you can set the maximum number of containers that can be
// // running at the same time. This helps mitigate the impact of unexpected
// // traffic spikes by instead downgrading performance. This limit is a
// // per-function limit. You can override the limit for each function using the
// // `maxInstances` option in the function's options, e.g.
// // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// // export const helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

import { onRequest } from "firebase-functions/v2/https";
import express from "express";
// Initialize your Express app
const app = express();

// =================================================================
//  COPY YOUR SERVER LOGIC FROM `server/index.ts` HERE
// =================================================================
//
//  Go to your original `server/index.ts` file and copy all of your
//  middleware (like express.json()), routes (app.get, app.post),
//  and database connection logic, and paste it in this section.
//
//  IMPORTANT: Do NOT copy the `app.listen(...)` part. Firebase handles that.
//
//  Example:
//  app.use(express.json()); // From your original file
//  app.get("/api/users", (req, res) => {
//      res.send("This is a response from my API!");
//  });
//
// =================================================================

// This line exposes your entire Express app as a single Cloud Function
// named "api". Firebase will handle all incoming requests.
export const api = onRequest(app);


