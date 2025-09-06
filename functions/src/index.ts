import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import express from "express";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as bcrypt from "bcryptjs";
import session from "express-session";
import {FirestoreStore} from "@google-cloud/connect-firestore";
import "express-session";

// This is the type declaration you created in `custom.d.ts`.
// It tells TypeScript about the `req.session.user` property.
declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      email: string;
    };
  }
}

setGlobalOptions({maxInstances: 10});

initializeApp({credential: applicationDefault()});
const db = getFirestore();

const app = express();
app.use(express.json());

// Configure Session Middleware to use Firestore
app.use(session({
    store: new FirestoreStore({
        dataset: db,
        kind: 'express-sessions',
    }),
    secret: "a_very_secret_key_for_your_app",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // In production this should be true if using HTTPS
      maxAge: 86400000 // 24 hours
    }
}));


// =================================================================
//  API ROUTES
// =================================================================

// --- USER REGISTRATION ENDPOINT ---
app.post("/api/register", async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).send({error: "Email and password are required."});
    }
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(409).send({error: "User with this email already exists."});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserRef = await usersRef.add({
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    return res.status(201).send({
      message: "User created successfully!",
      userId: newUserRef.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send({error: "Something went wrong. Please try again."});
  }
});

// --- USER LOGIN ENDPOINT ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required." });
    }
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(401).send({ error: "Invalid credentials." });
    }
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const hashedPassword = userData.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).send({ error: "Invalid credentials." });
    }
    req.session.user = {
        id: userDoc.id,
        email: userData.email
    };
    return res.status(200).send({
      message: "Login successful!",
      userId: userDoc.id,
      email: userData.email,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).send({ error: "Something went wrong. Please try again." });
  }
});

// --- USER LOGOUT ENDPOINT ---
app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ error: "Could not log out, please try again." });
        } else {
            res.clearCookie('connect.sid');
            return res.status(200).send({ message: "Logout successful." });
        }
    });
});

// --- CHECK SESSION ENDPOINT ---
app.get("/api/me", (req, res) => {
    if (req.session.user) {
        return res.status(200).send(req.session.user);
    } else {
        return res.status(401).send({ error: "Not authenticated" });
    }
});
// =================================================================

export const api = onRequest(app);