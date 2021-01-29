import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import getUser from "../../utils/functions/userfn";
import { modLogChannelId } from "../../utils/var";
import BaseCommand from "../../utils/structures/BaseCommand";
export default class BanCommand extends BaseCommand {
	constructor() {
		super("ban", "Bans a guild member by their ID or mention", []);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!message.member?.hasPermission("BAN_MEMBERS")) {
			message.reply("I am sorry, but you can not use this command.");
			return;
		}
		if (!message.guild?.me?.hasPermission("BAN_MEMBERS")) {
			message.reply("I am sorry, but I can not ban members.");
			return;
		}
		if (!args[0]) {
			message.reply("No user specified.");
			return;
		}
		const user = getUser(client, args[0]);
		if (!user) {
			message.channel.send(
				"User not found. Please specify a valid User ID or mention the person you would like to ban."
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
		if (member.hasPermission("BAN_MEMBERS")) {
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
		const banDmEmbed = new MessageEmbed();
		if (avatar) {
			banDmEmbed
				.setAuthor("csgo.srb Moderation Team", avatar)
				.setThumbnail(avatar);
		} else {
			banDmEmbed.setAuthor("csgo.srb Moderation Team");
		}
		banDmEmbed
			.addField(
				`You have been banned from the ${message.guild.name} server!`,
				`**Reason:**\n ${reason}`
			)
			.setTimestamp()
			.setColor("#7FE5F0");
		await member.send(banDmEmbed).catch((err) => {
			console.log(err);
			if (channel) {
				channel.send(`⚠ Unable to contact **${user.tag}**.`);
			}
		});
		await member
			.ban({
				reason,
			})
			.then(() => {
				const banEmbed = new MessageEmbed()
					.setDescription(`✅ ***${member.user.tag} was banned***`)
					.setColor("GREEN");
				message.channel.send(banEmbed);
				if (channel) {
					const banLogEmbed = new MessageEmbed();
					if (userAvatar) {
						banLogEmbed
							.setAuthor("Member Banned", userAvatar)
							.setThumbnail(userAvatar);
					} else {
						banLogEmbed.setAuthor("Member Banned");
					}
					banLogEmbed
						.setColor("RED")
						.setTimestamp()
						.addField("User", `<@${member.user.id}> ${member.user.tag}`)
						.addField("Banned By", `<@${message.author.id}>`)
						.addField("Reason", reason);
					channel.send(banLogEmbed);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
