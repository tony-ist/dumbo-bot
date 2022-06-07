import * as discordJsVoice from '@discordjs/voice'
import { AudioPlayerStatus, VoiceConnection } from '@discordjs/voice'
import fs from 'fs'
import config from './config'

export async function playAudio(connection: VoiceConnection) {
  return await new Promise<void>((resolve, reject) => {
    console.log('Playing audio...')
    const resource = discordJsVoice.createAudioResource(fs.createReadStream(config.audioPath))
    const player = discordJsVoice.createAudioPlayer()
    connection.subscribe(player)
    player.play(resource)
    player.on(AudioPlayerStatus.AutoPaused, () => {
      console.log('Audio player is auto paused')
    })
    player.on(AudioPlayerStatus.Playing, () => {
      console.log('Audio player is playing')
    })
    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Audio player stopped playing')
      resolve()
    })
    player.on('error', (error) => {
      console.error('Audio player error:', error)
      reject(error)
    })
  })
}
