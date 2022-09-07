import Discord, {GatewayIntentBits, Message} from 'discord.js'
import express from 'express'

(async () => {
    const server = express()
    let counter: number = 0

    const discordToken = process.env.DISCORD_TOKEN
    if (!discordToken) {
        console.error('Unable to start the bot. DISCORD_TOKEN is required!')
        return
    }


    const client = new Discord.Client({
        intents: GatewayIntentBits.Guilds
    })

    await client.login(discordToken)


    client.on('messageCreate', (message: Message) => {
      if (message.attachments.size > 0 && message.author.tag === 'Dasda120#6374') {
          counter++

          message.reply(`Dasda GIF counter: **${counter}**`)
      }
    })


    server.all('/', (req, res) => {
        res.send("Bot is running!")
    })

    server.listen(3000, () => {
        console.log('Server is ready.')
    })
})()


