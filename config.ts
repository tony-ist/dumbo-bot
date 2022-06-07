import path from 'path'
import fs from 'fs'

let configFileContent = '{}'
try {
  const configPath = path.resolve(__dirname, '../config.json')
  configFileContent = fs.readFileSync(configPath).toString()
} catch (e: any) {
  if (e?.code === 'ENOENT') {
    // eslint-disable-next-line no-console
    console.error('There is no config.json file in project root. Please create it from config.template.json.')
  }
  throw e
}

const configJson = JSON.parse(configFileContent)
const config = configJson as Config

interface Config {
  guildId: string
  discordApiToken: string
  channelIdToJoin: string
  audioPath: string
  repeatTimes: number
  pauseMs: number
}

export default config
