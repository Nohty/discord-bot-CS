import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import getUser from "../../utils/functions/userfn";
import { modLogChannelId } from "../../utils/var";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class KickCommand extends BaseCommand {
	constructor() {
		super("kick", "Kicks a guild member by their ID or mention.", []);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (message.channel.type === "dm") {
			message.channel.send("You can not use this command in dm.");
			return;
		}
		if (!message.member?.hasPermission("KICK_MEMBERS")) {
			message.reply("I am sorry, but you can not use this command.");
			return;
		}
		if (!message.guild?.me?.hasPermission("KICK_MEMBERS")) {
			message.reply("I am sorry, but I can not kick members.");
			return;
		}
		if (!args[0]) {
			message.reply("No user specified.");
			return;
		}
		const user = getUser(client, args[0]);
		if (!user) {
			message.channel.send(
				"User not found. Please specify a valid User ID or mention the person you would like to kick."
			);
			return;
		}
		const member = message.guild.member(user);
		if (!member) {
			message.channel.send(
				"Member not found. Make sure the specified user is in the server."
			);
			return;
		}
		if (member.hasPermission("KICK_MEMBERS")) {
			message.channel.send("❌ That user is a mod/admin, I can't do that.");
			return;
		}
		let reason = args.slice(1).join(" ");
		if (!reason) {
			reason = "No reason specified.";
		}
		const channel = message.guild.channels.cache.get(
			modLogChannelId
		) as TextChannel;
		const avatar = client.user?.avatarURL();
		const userAvatar = member.user.avatarURL();
		const kickDmEmbed = new MessageEmbed();
		if (avatar) {
			kickDmEmbed
				.setAuthor("csgo.srb Moderation Team", avatar)
		} else {
			kickDmEmbed.setAuthor("csgo.srb Moderation Team");
		}
		kickDmEmbed
			.setDescription(
				`**You have been kicked from the ${message.guild.name} server!**`
			)
			.addField("Reason:", reason)
			.setTimestamp()
			.setColor("#7FE5F0");
		await member.send(kickDmEmbed).catch((err) => {
			console.log(err);
			if (channel) {
				channel.send(`⚠ Unable to contact **${user.tag}**.`);
			}
		});
		await member
			.kick(reason)
			.then(() => {
				const kickEmbed = new MessageEmbed()
					.setDescription(`✅ ***${member.user.tag} was kicked***`)
					.setColor("GREEN");
				message.channel.send(kickEmbed);
				if (channel) {
					const kickLogEmbed = new MessageEmbed();
					if (userAvatar) {
						kickLogEmbed
							.setAuthor("Member Kicked", userAvatar)
							.setThumbnail(userAvatar);
					} else {
						kickLogEmbed.setAuthor("Member Kicked");
					}
					kickLogEmbed
						.setColor("RED")
						.setTimestamp()
						.addField("User", `<@${member.user.id}> ${member.user.tag}`)
						.addField("Kicked By", `<@${message.author.id}>`)
						.addField("Reason", reason);
					channel.send(kickLogEmbed);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
