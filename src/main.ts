import 'dotenv/config'
import Discord, {GatewayIntentBits, Partials} from 'discord.js'
import express from 'express'

const isValidTenorUrl = (urlString: string) => {
    try {
        const url = new URL(urlString)
        return Boolean(url) && url.host === 'tenor.com'
    }
    catch(e){
        return false
    }
}

(async () => {
    const server = express()
    let counter: number = 0

    const discordToken = process.env.DISCORD_TOKEN
    if (!discordToken) {
        console.error('Unable to start the bot. DISCORD_TOKEN is required!')
        return
    }

    const userInteractionTag = process.env.USER_INTERACTION_TAG
    if (!userInteractionTag) {
        console.error('Unable to start the bot. USER_INTERACTION_TAG is required!')
        return
    }


    const client = new Discord.Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
            Partials.User,
            Partials.GuildMember,
            Partials.Reaction
        ],
    })
    client.on('ready', () => {
        console.log(`Logged in as ${client.user?.tag}!`);
    });

    client.on('messageCreate', (message) => {
        if (message.author.tag === userInteractionTag && isValidTenorUrl(message.content)) {
            counter++

            const replyText = `Dasda GIF counter: **${counter}**`
            message.reply(replyText)
            console.log(replyText)
        }
    })

    client.login(discordToken)

    server.all('/', (req: any, res: any) => {
        res.send("Bot is running!")
    })

    server.listen(3000, () => {
        console.log('Server is ready.')
    })
})()


