
# White AI discord & Moderation bot

## Overview
The **White Teacher Discord Bot** is a powerful bot designed to integrate AI-based responses into your Discord server. It utilizes OpenAI’s GPT model to generate human-like responses based on user queries. This bot can be customized to fit a wide range of use cases, such as interactive Q&A, educational assistance, or general information retrieval.

## Features
- **AI-Powered Responses**: The bot utilizes OpenAI’s GPT models to generate accurate and context-aware responses.
- **Command-Based Interaction**: Users trigger responses by typing commands starting with `=`.
- **Channel-Specific Interaction**: The bot operates in a designated channel, ensuring focused interaction.
- **Error Handling**: In case of API errors, the bot provides appropriate feedback.

## Prerequisites
Before running the bot, ensure you have the following:
- **Discord Bot Token**: Obtain from [Discord Developer Portal](https://discord.com/developers/applications).
- **OpenAI API Key**: Obtain from [OpenAI](https://beta.openai.com/signup) to use their API.

- Moderation Tools
Kick & Ban Commands: Admins can kick or ban users with kick and ban commands.
Role Management: Commands like add, remove, mute, and unmute allow server admins to manage user roles and permissions effectively.
Message Deletion: The purge command enables admins to delete a bulk of messages for keeping the channel clean.
Warnings & Logs: Users can be warned using the warn command, and warnings can be purged using purgewarns.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sudoytext/White-Teacher.git
   cd White-Teacher
   ```

2. **Create `.env` File**:
   ```bash
   nano .env
   ```
   Add your bot token and OpenAI API key:
   ```env
   DISCORD_BOT_TOKEN=your-discord-bot-token
   AI_API_KEY=your-openai-api-key
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Bot**:
   ```bash
   node index.js
   ```

## Configuration
- **CHANNEL_ID**: The bot listens to messages in the specified Discord channel. You can change the `CHANNEL_ID` variable in the `index.js` file to target different channels.
  
## Usage
1. Invite the bot to your server using the OAuth2 URL from the Discord Developer Portal.
2. In your Discord server, use the command `=hello` or any other message starting with `=` to interact with the bot.
3. The bot will respond with AI-generated replies based on the input.

## Error Handling
If there are any issues with the OpenAI API or unexpected errors, the bot will send an error message to the channel, informing the user of the issue.

## License
This project is licensed under the [MIT License](LICENSE).

---

### Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.

---

### Contact
- **GitHub**: [SudoyText](https://github.com/sudoytext)
- **Discord**: [username:ytext]
