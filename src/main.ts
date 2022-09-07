import 'dotenv/config'
import Discord, {GatewayIntentBits, Partials} from 'discord.js'
import express from 'express'
import {
    createFileIfNotExists,
    extractUrls,
    isValidTenorUrl,
    readOrCreateInitialState, resetStateEveryWeekInterval,
    writeStateToFile
} from './helpers'

(async () => {
    const STATE_FILE_NAME = 'data/state.json'
    const wasFileCreated = await createFileIfNotExists(STATE_FILE_NAME)
    if (wasFileCreated) {
        console.info(`Soubor v místě: ${STATE_FILE_NAME} byl úspěšně vytvořen!`)
    }

    let state = readOrCreateInitialState(STATE_FILE_NAME)
    const server = express()

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
        const urls = extractUrls(message.content)

        if (!!urls) {
            for (const url of urls) {
                if (message.author.tag === userInteractionTag && isValidTenorUrl(message.content)) {
                    state.counter++

                    const replyText = `Dasda GIF counter: **${state.counter}**`
                    writeStateToFile(STATE_FILE_NAME, state)

                    message.reply(replyText)
                    console.log(replyText)
                    return
                }
            }
        }
    })

    // Každou minutu kontrolujeme, jestli nastal čas vyresetovat state
    setInterval(() => {
        const newState = resetStateEveryWeekInterval(STATE_FILE_NAME, state)
        if (!!newState) {
            state = newState
        }
    }, 60000)

    client.login(discordToken)

    server.all('/', (req: any, res: any) => {
        res.send("Bot is running!")
    })

    server.listen(3000, () => {
        console.log('Server is ready.')
    })
})()


