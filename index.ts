import Discord from 'discord.js'
import * as discordJsVoice from '@discordjs/voice'
import config from './config'
import { playAudio } from './play-audio'
import { DiscordGatewayAdapterCreator } from '@discordjs/voice'
import { setTimeout as sleep } from 'node:timers/promises'

async function run(): Promise<void> {
  const INTENTS = Discord.Intents.FLAGS

  console.log('Initializing discord client...')

  const discordClient = new Discord.Client({
    intents: [
      INTENTS.GUILD_VOICE_STATES
    ]
  })

  await discordClient.login(config.discordApiToken)

  console.log('Bot logged in! Bot client id:', discordClient.user?.id)

  const guild = discordClient.guilds.resolve(config.guildId)

  if (guild === null) {
    throw new Error(`Cannot resolve guild with id ${config.guildId}`)
  }

  const channels = await guild.channels.fetch()

  const voiceChannel = guild.channels.resolve(config.channelIdToJoin)

  if (voiceChannel === null) {
    throw new Error(`Cannot resolve channel with id ${config.channelIdToJoin}`)
  }

  const connection = discordJsVoice.joinVoiceChannel({
    channelId: config.channelIdToJoin,
    guildId: config.guildId,
    // https://github.com/discordjs/discord.js/issues/7273#issuecomment-1140522858
    adapterCreator: guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
  })

  console.log('Joined voice channel')

  for (let i = 0; i < config.repeatTimes; i++) {
    await playAudio(connection)

    await sleep(config.pauseMs)
  }

  console.log('Exiting')

  process.exit(0)
}

run().catch(console.error)
