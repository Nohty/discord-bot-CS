import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import getUser from "../../utils/functions/userfn";
import { modLogChannelId, muteRoleId } from "../../utils/var";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class MuteCommand extends BaseCommand {
	constructor() {
		super("mute", "mod", [], "Mutes a user.", [
			"mute <userID | mention> [reason]",
		]);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (message.channel.type === "dm") {
			message.channel.send("You can not use this command in dm.");
			return;
		}
		if (!message.member?.hasPermission("MANAGE_ROLES")) {
			message.reply("I am sorry, but you can not use this command.");
			return;
		}
		if (!message.guild?.me?.hasPermission("MANAGE_ROLES")) {
			message.reply("I am sorry, but I can not mute members.");
			return;
		}
		if (!args[0]) {
			message.reply("No user specified.");
			return;
		}
		const user = getUser(client, args[0]);
		if (!user) {
			message.channel.send(
				"User not found. Please specify a valid User ID or mention the person you would like to mute."
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
		if (member.hasPermission("MANAGE_ROLES")) {
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
		const mutedRole = message.guild.roles.cache.get(muteRoleId);
		if (!mutedRole) {
			message.channel.send("Mute role not found.");
			return;
		}
		if (member.roles.cache.some((role) => role.id === muteRoleId)) {
			message.channel.send("This user is already muted");
			return;
		}
		const muteDmEmbed = new MessageEmbed();
		if (avatar) {
			muteDmEmbed.setAuthor("csgo.srb Moderation Team", avatar);
		} else {
			muteDmEmbed.setAuthor("csgo.srb Moderation Team");
		}
		muteDmEmbed
			.setDescription(
				`**You have been Muted on the ${message.guild.name} server!**`
			)
			.addField("Reason:", reason)
			.setTimestamp()
			.setColor("#7FE5F0");
		await member.send(muteDmEmbed).catch((err) => {
			console.log(err);
			if (channel) {
				channel.send(`⚠ Unable to contact **${user.tag}**.`);
			}
		});
		await member.roles
			.add(mutedRole)
			.then(() => {
				const muteEmbed = new MessageEmbed()
					.setDescription(`✅ ***${member.user.tag} was muted***`)
					.setColor("GREEN");
				message.channel.send(muteEmbed);
				if (channel) {
					const muteLogEmbed = new MessageEmbed();
					if (userAvatar) {
						muteLogEmbed
							.setAuthor("Member Muted", userAvatar)
							.setThumbnail(userAvatar);
					} else {
						muteLogEmbed.setAuthor("Member Muted");
					}
					muteLogEmbed
						.setColor("ORANGE")
						.setTimestamp()
						.addField("User", `<@${member.user.id}> ${member.user.tag}`)
						.addField("Muted By", `<@${message.author.id}>`)
						.addField("Reason", reason);
					channel.send(muteLogEmbed);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
