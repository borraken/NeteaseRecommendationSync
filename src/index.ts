import { dispatchMigrateLikes } from 'action/migrateLikes'
import { dispatchNeteaseAuth } from 'action/neteaseAuth'
import { schedulerShouldSkip } from 'action/scheduler'
import { dispatchSpotifyAuth } from 'action/spotifyAuth'
import { dispatchSyncRecommendations } from 'action/sync/dispatcher'
import { SYNC_TIME_PARSED, SYNC_TIME_TZ } from 'config'
import { logger } from 'modules/logger'
import { addSchedule } from 'modules/scheduler'

const shouldIgnoreSkipCheck = process.argv.includes('--ignore-skip-check')

async function sync() {
  if (shouldIgnoreSkipCheck) {
    logger.info('scheduler: skipping duplication check')
  } else if (await schedulerShouldSkip()) {
    return
  }
  await dispatchNeteaseAuth()
  await dispatchSpotifyAuth()
  await dispatchSyncRecommendations()
}

async function migrate() {
  await dispatchMigrateLikes()
}

async function main() {
  await sync()
  // await migrate()

  addSchedule(
    'sync',
    SYNC_TIME_PARSED.hour,
    SYNC_TIME_PARSED.minute,
    SYNC_TIME_TZ,
    sync,
  )
}

main()
