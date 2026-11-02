/**
 * Platform kill-switch controlled from Firebase Console.
 *
 * Firestore path:
 *   Collection: settings
 *   Document:   platform
 *   Field:      serverDown (boolean)
 *
 * Set serverDown to true → website/app shows only the Server Down page
 * and API routes refuse requests. Set it back to false to restore access.
 */

export const SERVER_STATUS_COLLECTION = "settings";
export const SERVER_STATUS_DOC = "platform";
export const SERVER_DOWN_FIELD = "serverDown";

export const SERVER_DOWN_MESSAGE =
  "Server down. Please check your backend.";

export type PlatformSettings = {
  serverDown?: boolean;
  /** Optional custom message shown on the down page. */
  serverDownMessage?: string;
};
