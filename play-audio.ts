import { AudioPlayerStatus, VoiceConnection } from '@discordjs/voice'
import * as discordJsVoice from '@discordjs/voice'
import fs from 'fs'

const audioPath = './yes.mp3'

export async function playAudio(connection: VoiceConnection) {
  return await new Promise<void>((resolve, reject) => {
    console.log('Playing audio...')
    const resource = discordJsVoice.createAudioResource(fs.createReadStream(audioPath))
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
      resolve()
    })
    player.on('error', (error) => {
      console.error('Audio player error:', error)
      reject(error)
    })
  })
}
