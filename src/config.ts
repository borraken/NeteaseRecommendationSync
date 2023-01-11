import { DateTime } from 'luxon'
import fs from 'fs'
import YAML from 'yaml'
import {get as getObjectValue} from 'lodash'


const configFile = fs.readFileSync('./config.yaml', 'utf8')
const userConfig = YAML.parse(configFile)

function getRequiredEnvVar(name: string ): string | boolean {
  const value = getObjectValue(userConfig,name)
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

// Obtain Spotify Client ID and Secret at https://developer.spotify.com/dashboard/applications
export const SPOTIFY_CLIENT_ID = getRequiredEnvVar('spotify.CLIENT_ID')
export const SPOTIFY_CLIENT_SECRET = getRequiredEnvVar('spotify.CLIENT_SECRET')


export const SYNC_TIME_TZ = 'Asia/Shanghai'

// SYNC_TIME is the time to sync recommendations, in format of "HH:mm" (24-hour clock)
// Timezone of SYNC_TIME is defined as Asia/Shanghai and is not configurable due to the nature
// of interacting with Netease API in which is also in Asia/Shanghai.


export const SYNC_TIME = getObjectValue(userConfig,'sync.syncTime') || '06:10'

export const SYNC_TIME_PARSED = DateTime.fromFormat(SYNC_TIME, 'HH:mm', {
  zone: SYNC_TIME_TZ,
})

export const OAUTH_REDIRECT_SERVER_PORT = parseInt(
  getObjectValue(userConfig,'netsase.oauthPort') || '3000',
)

export const NETEASE_MUSIC_PHONE = getRequiredEnvVar('netsase.phoneNumber')
export const NETEASE_MUSIC_PASSWORD = getRequiredEnvVar('netsase.password')

export const SYNC_DAILY = getRequiredEnvVar('sync.daily') === true
export const SYNC_RADAR = getRequiredEnvVar('sync.radar') === true

// not using fromFormat because it is day agnostic
export const NETEASE_CALENDAR_DAY_BEGINNING_TIME = { hour: 6, minute: 0 }
