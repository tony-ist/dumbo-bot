import Discord from 'discord.js'
import * as discordJsVoice from '@discordjs/voice'
import config from './config.json'
import { playAudio } from './play-audio'
import { DiscordGatewayAdapterCreator } from '@discordjs/voice'

async function run(): Promise<void> {
  const INTENTS = Discord.Intents.FLAGS

  console.log('Initializing discord client...')

  const discordClient = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
      INTENTS.DIRECT_MESSAGES,
      INTENTS.GUILDS,
      INTENTS.GUILD_MESSAGES,
      INTENTS.GUILD_PRESENCES,
      INTENTS.GUILD_MESSAGE_REACTIONS,
      INTENTS.GUILD_VOICE_STATES,
    ],
  })

  // const discordClient = new Discord.Client({
  //   intents: [
  //     INTENTS.GUILD_VOICE_STATES
  //   ]
  // })

  await discordClient.login(config.discordApiToken)

  console.log('Bot logged in! Bot client id:', discordClient.user?.id)

  const guild = discordClient.guilds.resolve(config.guildId)

  if (guild === null) {
    throw new Error(`Cannot resolve guild with id ${config.guildId}`)
  }

  const channels = await guild.channels.fetch()
  console.log(channels)

  const voiceChannel = guild.channels.resolve(config.channelIdToJoin)

  if (voiceChannel === null) {
    throw new Error(`Cannot resolve channel with id ${config.channelIdToJoin}`)
  }

  const connection = discordJsVoice.joinVoiceChannel({
    channelId: config.channelIdToJoin,
    guildId: config.guildId,
    adapterCreator: guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
  })

  console.log('Joined voice channel')

  await playAudio(connection)
}

run().catch(console.error)
