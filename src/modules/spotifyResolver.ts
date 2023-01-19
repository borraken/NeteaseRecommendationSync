import { NeteaseSong } from 'api/netease'
import { searchSpotify,searchSpotifyOnlyBySongName } from 'api/spotify'
import { logger } from 'modules/logger'
import { SEARCH_BY_NAME } from 'config'

export async function resolveSpotifySongsFromNeteaseSongs(
  neteaseRecommendations: NeteaseSong[],
) {
  return (
    await Promise.all(
      neteaseRecommendations.map(async (song) => {
        const track = await (SEARCH_BY_NAME? searchSpotifyOnlyBySongName(song) : searchSpotify(song))

        if (!track) {
          logger.info(
            `spotify: netease song "${song.name}" not found in spotify`,
          )
        }
        return {
          ...track,
          originalId: song.id,
          originalName: song.name,
          originalArtists: song.artists.join(', '),
          originalAlbum: song.album,
          originalReason: song.reason,
        }
      }),
    )
  ).filter((track) => !!track.uri)
}
