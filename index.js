require('dotenv').config();
const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');

const token = process.env.DISCORD_BOT_TOKEN;
const aiApiKey = process.env.AI_API_KEY;

const openai = require("openai");
openai.apiKey = aiApiKey;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const CHANNEL_ID = "1323010837983662155";

async function errorEmbed(text, message) {
    const embed = new MessageEmbed()
        .setColor("#FF7676")
        .setDescription(`**❌ | ${text}**`);
    return message.channel.send(embed);
}

client.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;
    if (message.channel.id !== CHANNEL_ID) return;

    try {
        const query = message.content.trim();
        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: query,
            max_tokens: 150,
            temperature: 0.7
        });

        const aiResponse = completion.data.choices[0].text.trim();
        message.reply(aiResponse); // Send the AI response back to the channel

    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        errorEmbed('Bot error, please try again!', message);
    }
});

client.once('ready', () => {
    console.clear();
    console.log(`${client.user.tag} is online!`);
});

client.login(token);
