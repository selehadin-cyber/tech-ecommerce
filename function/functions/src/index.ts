import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const onRatingUpdate = functions.firestore
    .document("products/{productName}")
    .onUpdate((Change) => {
      const after = Change.after.data();
      const before = Change.before.data();
      if (after.reviews == before.reviews) {
        return null;
      }
      let average = after.average;
      if (!average) {
        average = 0;
      }
      const stars = after.reviews.map(
          (review: any) => review[Object.keys(review)[0]].star
      );
      const sum = stars.reduce((a: number, b: number) => a + b, 0);
      const avg = sum / stars.length;
      return Change.after.ref.set({
        average: avg,
      }, {merge: true});
    });
