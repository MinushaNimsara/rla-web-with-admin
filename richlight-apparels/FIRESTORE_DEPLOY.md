# Fix "Missing or insufficient permissions" (Edit About Us / Firestore)

This error means your **Firestore security rules** in Firebase do not yet allow access to the collections your app uses (including `aboutPage` for the Edit About Us page). Deploy the rules once using one of the options below.

---

## Option A: Deploy rules from Firebase Console (no CLI)

1. Open [Firebase Console](https://console.firebase.google.com/) and select your project.
2. Go to **Firestore Database** → **Rules**.
3. Replace the entire rules with the contents of the `firestore.rules` file in this folder (it already includes `aboutPage` and all other collections).
4. Click **Publish**.

---

## Option B: Deploy rules using Firebase CLI

1. Install Firebase CLI if needed: `npm install -g firebase-tools`
2. Log in and select project (if not already):
   ```bash
   firebase login
   firebase use <your-project-id>
   ```
3. From this folder (`richlight-apparels`), run:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. When it says "Deploy complete", reload the Edit About Us page and try again.

After the rules are published, the Edit About Us page should load and save without the permissions error.
