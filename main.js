const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

bot.on("ready", () => {
    console.log(`${bot.user.tag} is online!`);
    bot.user.setActivity("Moderating your server!", { type: "WATCHING" });
});

bot.on("message", async message => {
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "help") {
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle(`${bot.user.username}'s Commands`)
            .setDescription(`**Prefix:** ${config.prefix}`)
            .addField(`\`ping\``, `Check the bot's latency.`)
            .addField(`\`kick\``, `Usage: **${config.prefix}kick [@User] [Reason]**`)
            .addField(`\`ban\``, `Usage: **${config.prefix}ban [@User] [Reason]**`)
            .addField(`\`add\``, `Add a role to a user. **Usage:** ${config.prefix}add [@User] [Role]`)
            .addField(`\`remove\``, `Remove a role from a user. **Usage:** ${config.prefix}remove [@User] [Role]`)
            .addField(`\`purge\``, `Delete messages. **Usage:** ${config.prefix}purge [number]`)
            .addField(`\`rps\``, `Play rock-paper-scissors with the bot.`)
            .addField(`\`say\``, `Let the bot say something.`)
            .addField(`\`modlog\``, `View moderation logs.`)
            .addField(`\`warn\``, `Warn a user. **Usage:** ${config.prefix}warn [@User] [Reason]`)
            .addField(`\`mute\``, `Mute a user. **Usage:** ${config.prefix}mute [@User] [Reason]`)
            .addField(`\`unmute\``, `Unmute a user.`)
            .addField(`\`purgewarns\``, `Purge all warnings for a user.`)
            .addField(`\`roleinfo\``, `Get information about a role.`)
        message.channel.send(helpEmbed);
    }

    if (command === "ping") {
        message.channel.send(`Pong! Latency: **${Date.now() - message.createdTimestamp}ms**`);
    }

    if (command === "kick") {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Insufficient permissions (`Kick Members`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        if (!member.kickable) return message.channel.send("This user is unkickable.").then(msg => msg.delete({ timeout: 30000 }));
        const reason = args.slice(1).join(" ") || "No reason provided";
        member.kick(reason).then(() => {
            message.channel.send(`${member.user.tag} was kicked for: ${reason}`);
        }).catch(err => {
            message.channel.send("An error occurred while trying to kick the user.");
            console.error(err);
        });
    }

    if (command === "ban") {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Insufficient permissions (`Ban Members`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        if (!member.bannable) return message.channel.send("This user is unbannable.").then(msg => msg.delete({ timeout: 30000 }));
        const reason = args.slice(1).join(" ") || "No reason provided";
        member.ban({ reason }).then(() => {
            message.channel.send(`${member.user.tag} was banned for: ${reason}`);
        }).catch(err => {
            message.channel.send("An error occurred while trying to ban the user.");
            console.error(err);
        });
    }

    if (command === "add") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Insufficient permissions (`Manage Roles`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        const roleName = args.slice(1).join(" ");
        if (!roleName) return message.channel.send("You haven't specified a role.").then(msg => msg.delete({ timeout: 30000 }));
        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (!role) return message.channel.send("This role does not exist.").then(msg => msg.delete({ timeout: 30000 }));
        if (member.roles.cache.has(role.id)) return message.channel.send(`This user already has the ${roleName} role.`).then(msg => msg.delete({ timeout: 30000 }));
        member.roles.add(role).then(() => {
            message.channel.send(`${roleName} role added to ${member.displayName}.`);
        }).catch(err => {
            message.channel.send("An error occurred while adding the role.");
            console.error(err);
        });
    }

    if (command === "remove") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Insufficient permissions (`Manage Roles`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        const roleName = args.slice(1).join(" ");
        if (!roleName) return message.channel.send("You haven't specified a role.").then(msg => msg.delete({ timeout: 30000 }));
        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (!role) return message.channel.send("This role does not exist.").then(msg => msg.delete({ timeout: 30000 }));
        if (!member.roles.cache.has(role.id)) return message.channel.send(`This user does not have the ${roleName} role.`).then(msg => msg.delete({ timeout: 30000 }));
        member.roles.remove(role).then(() => {
            message.channel.send(`${roleName} role removed from ${member.displayName}.`);
        }).catch(err => {
            message.channel.send("An error occurred while removing the role.");
            console.error(err);
        });
    }

    if (command === "purge") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Insufficient permissions (`Manage Messages`)").then(msg => msg.delete({ timeout: 30000 }));
        const number = parseInt(args[0]);
        if (!number || isNaN(number) || number < 2 || number > 100) return message.channel.send("You haven't specified a valid number to purge.").then(msg => msg.delete({ timeout: 30000 }));
        message.channel.bulkDelete(number).then(deleted => {
            message.channel.send(`Successfully purged ${deleted.size} messages.`).then(msg => msg.delete({ timeout: 5000 }));
        }).catch(err => {
            message.channel.send("An error occurred while trying to purge messages.");
            console.error(err);
        });
    }

    if (command === "roleinfo") {
        const roleName = args.join(" ");
        if (!roleName) return message.channel.send("You haven't specified a role.").then(msg => msg.delete({ timeout: 30000 }));
        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (!role) return message.channel.send("This role does not exist.").then(msg => msg.delete({ timeout: 30000 }));
        const embed = new Discord.MessageEmbed()
            .setTitle(`Role Info: ${role.name}`)
            .setColor(role.color)
            .addField("ID", role.id, true)
            .addField("Members", role.members.size, true)
            .addField("Color", role.hexColor, true)
            .addField("Permissions", role.permissions.toArray().join(", "))
            .addField("Position", role.position, true)
            .setTimestamp();
        message.channel.send(embed);
    }

    if (command === "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Insufficient permissions (`Manage Messages`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        const reason = args.slice(1).join(" ") || "No reason provided";
        let warnings = bot.warnings.get(member.id) || [];
        warnings.push({ reason, moderator: message.author.tag, timestamp: new Date().toISOString() });
        bot.warnings.set(member.id, warnings);
        message.channel.send(`${member.user.tag} has been warned for: ${reason}`);
    }

    if (command === "mute") {
        if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send("Insufficient permissions (`Mute Members`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        if (member.voice.serverMute) return message.channel.send("This user is already muted.").then(msg => msg.delete({ timeout: 30000 }));
        const reason = args.slice(1).join(" ") || "No reason provided";
        member.voice.setMute(true, reason).then(() => {
            message.channel.send(`${member.user.tag} has been muted for: ${reason}`);
        }).catch(err => {
            message.channel.send("An error occurred while trying to mute the user.");
            console.error(err);
        });
    }

    if (command === "unmute") {
        if (!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send("Insufficient permissions (`Mute Members`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        if (!member.voice.serverMute) return message.channel.send("This user is not muted.").then(msg => msg.delete({ timeout: 30000 }));
        member.voice.setMute(false).then(() => {
            message.channel.send(`${member.user.tag} has been unmuted.`);
        }).catch(err => {
            message.channel.send("An error occurred while trying to unmute the user.");
            console.error(err);
        });
    }

    if (command === "purgewarns") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Insufficient permissions (`Manage Messages`)").then(msg => msg.delete({ timeout: 30000 }));
        const member = message.mentions.members.first();
        if (!member) return message.channel.send("You haven't mentioned a user.").then(msg => msg.delete({ timeout: 30000 }));
        // Assuming you have a warnings collection or database
        if (!bot.warnings.has(member.id)) return message.channel.send("This user has no warnings.").then(msg => msg.delete({ timeout: 30000 }));
        bot.warnings.delete(member.id);
        message.channel.send(`${member.user.tag}'s warnings have been cleared.`);
    }
    if (command === "rps") {
        const options = ["rock", "paper", "scissors"];
        const choice = args[0];
        if (!options.includes(choice)) return message.channel.send("Invalid option! Please choose: `rock`, `paper`, or `scissors`.");
        const botChoice = options[Math.floor(Math.random() * options.length)];
        if (choice === botChoice) return message.channel.send(`It's a tie! We both chose ${botChoice}.`);
        if ((choice === "rock" && botChoice === "scissors") || (choice === "paper" && botChoice === "rock") || (choice === "scissors" && botChoice === "paper")) {
            return message.channel.send(`You win! I chose ${botChoice}.`);
        } else {
            return message.channel.send(`You lose! I chose ${botChoice}.`);
        }
    }
});

bot.login(config.token);
