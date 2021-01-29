import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import getUser from "../../utils/functions/userfn";
import { modLogChannelId, muteRoleId } from "../../utils/var";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class UnmuteCommand extends BaseCommand {
	constructor() {
		super("unmute", "Unmute a user.", []);
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
		const channel = message.guild.channels.cache.get(
			modLogChannelId
		) as TextChannel;
		const userAvatar = member.user.avatarURL();
		const mutedRole = message.guild.roles.cache.get(muteRoleId);
		if (!mutedRole) {
			message.channel.send("Mute role not found.");
			return;
		}
		if (!member.roles.cache.some((role) => role.id === muteRoleId)) {
			message.channel.send("This user is not muted");
			return;
		}
		await member.roles
			.remove(mutedRole)
			.then(() => {
				const unmuteEmbed = new MessageEmbed()
					.setDescription(`✅ ***${member.user.tag} was unmuted***`)
					.setColor("GREEN");
				message.channel.send(unmuteEmbed);
				if (channel) {
					const unmuteLogEmbed = new MessageEmbed();
					if (userAvatar) {
						unmuteLogEmbed
							.setAuthor("Member Unmuted", userAvatar)
							.setThumbnail(userAvatar);
					} else {
						unmuteLogEmbed.setAuthor("Member Unmuted");
					}
					unmuteLogEmbed
						.setTimestamp()
						.addField("User", `<@${member.user.id}> ${member.user.tag}`)
						.addField("Unmuted By", `<@${message.author.id}>`);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
