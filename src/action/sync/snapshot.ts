import { NeteaseSong } from 'api/netease'
import { mkdir, writeFile } from 'fs/promises'
import { logger } from 'modules/logger'

interface SyncContextSnapshot {
  syncId: string
  neteaseRecommendations: any
  spotifyTracks: any
  summaryText: string
}

export async function saveSyncContextSnapshot(
  syncContext: SyncContextSnapshot,
) {
  const base = `state/snapshots/${syncContext.syncId}`
  await mkdir(base, { recursive: true })
  await writeFile(
    `${base}/netease-recommendations.json`,
    JSON.stringify(syncContext.neteaseRecommendations, null, 2),
  )
  await writeFile(
    `${base}/spotify-tracks.json`,
    JSON.stringify(syncContext.spotifyTracks, null, 2),
  )
  await writeFile(`${base}/summary.md`, syncContext.summaryText)
}

export async function persistDailyRecommendationSynchronizationContext({
  syncId,
  nowISO,
  nowDateInShanghai,
  neteaseRecommendations,
  neteaseRecommendationsOriginal,
  spotifyTracks,
}: {
  syncId: string
  nowISO: string
  nowDateInShanghai: string
  neteaseRecommendations: NeteaseSong[]
  neteaseRecommendationsOriginal: any
  spotifyTracks: any[]
}) {
  const summary = `## Netease Daily crawled at ${nowISO}

## Original Songs
${spotifyTracks
  .map(
    (track) =>
      `- ${track.originalName} (${track.originalArtists}) - ${track.originalAlbum} - ${track.originalReason}`,
  )
  .join('\n')}`

  await saveSyncContextSnapshot({
    syncId,
    neteaseRecommendations: neteaseRecommendationsOriginal,
    spotifyTracks: spotifyTracks,
    summaryText: summary,
  })

  logger.info('persistence: saved sync context snapshot to store')
}
