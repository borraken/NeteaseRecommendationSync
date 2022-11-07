import { SYNC_TIME } from "config";
import { DateTime } from "luxon";
import { store } from "store";

export async function schedulerShouldSkip() {
  const lastSync = store.getState().scheduler.lastSync;
  if (!lastSync) return false;

  const lastSyncDate = DateTime.fromISO(lastSync);
  const cutTimeOfToday = DateTime.fromFormat(SYNC_TIME, "HH:mm", {
    zone: "Asia/Shanghai",
  });
  // If the last sync is after the cut time of today, we should skip (we already synced today)
  const shouldSkip = lastSyncDate > cutTimeOfToday;
  if (shouldSkip) {
    console.log("scheduler: skipping due to already synced at " + lastSync);
  }
  return shouldSkip;
}
