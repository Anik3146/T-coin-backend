// src/utils/firebase.ts
import * as admin from "firebase-admin";
import serviceAccount from "../firebase-service-account.json"; // adjust path as needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
