
import { db } from '@/lib/firebase';
import { doc, runTransaction, serverTimestamp, increment } from 'firebase/firestore';

/**
 * Adds points for a specific user action if it hasn't been rewarded before.
 * @param actionId A unique ID for the action (e.g., 'read_topic_slug', 'ask_ai_timestamp').
 * @param points The number of points to award.
 * @returns {Promise<boolean>} True if points were awarded, false otherwise.
 */
export async function addPointsForAction(actionId: string, points: number): Promise<boolean> {
  const licenseKey = localStorage.getItem('licenseKey');
  if (!licenseKey) {
    console.error('No license key found, cannot add points.');
    return false;
  }

  const licenseRef = doc(db, 'licenses', licenseKey);
  const actionRef = doc(db, 'actions', actionId);

  try {
    await runTransaction(db, async (transaction) => {
      const actionDoc = await transaction.get(actionRef);
      if (actionDoc.exists()) {
        // Action already rewarded, do nothing.
        return;
      }

      // Action not rewarded yet, award points.
      transaction.update(licenseRef, {
        points: increment(points),
      });

      // Mark the action as completed.
      transaction.set(actionRef, {
        licenseKey: licenseKey, // Associate action with license
        completedAt: serverTimestamp(),
        pointsAwarded: points,
      });
    });

    console.log(`Awarded ${points} points for action: ${actionId}`);
    return true;
  } catch (error) {
    console.error('Transaction failed: ', error);
    return false;
  }
}
