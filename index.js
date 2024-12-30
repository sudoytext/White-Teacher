require('dotenv').config();
const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');

const token = process.env.DISCORD_BOT_TOKEN;
const aiApiKey = process.env.AI_API_KEY;

const openai = require("openai"); // Importing OpenAI API
openai.apiKey = aiApiKey;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const CHANNEL_ID = "1323010837983662155"; // Channel ID where the bot will listen

async function errorEmbed(text, message) {
    const embed = new MessageEmbed()
        .setColor("#FF7676")
        .setDescription(`**❌ | ${text}**`);
    return message.channel.send(embed);
}

client.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;
    if (message.channel.id !== CHANNEL_ID) return; // Check if the message is from the correct channel

    try {
        const query = message.content.trim(); // Extract the message content
        const completion = await openai.createCompletion({
            model: 'text-davinci-003', // Choose a model (like 'gpt-3.5-turbo' or 'gpt-4')
            prompt: query, // Send the user query as a prompt
            max_tokens: 150, // Limit response length
            temperature: 0.7 // Controls creativity of the response
        });

        const aiResponse = completion.data.choices[0].text.trim(); // Extract AI-generated response
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
