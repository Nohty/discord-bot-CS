import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import getUser from "../../utils/functions/userfn";
import { modLogChannelId } from "../../utils/var";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class UnbanCommand extends BaseCommand {
	constructor() {
		super(
			"unban",
			"mod",
			[],
			"Unbans a guild member by their ID or mention.",
			[]
		);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (message.channel.type === "dm") {
			message.channel.send("You can not use this command in dm.");
			return;
		}
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
		try {
			const channel = message.guild.channels.cache.get(
				modLogChannelId
			) as TextChannel;
			const userAvatar = user.avatarURL();
			const banList = await message.guild.fetchBans();
			const bannedUser = banList.find(
				(bannedMember) => bannedMember.user.id === user.id
			);
			if (!bannedUser) {
				message.channel.send("This user is not banned.");
				return;
			}
			message.guild.members.unban(user.id).then(() => {
				const unbanEmbed = new MessageEmbed()
					.setDescription(`✅ ***${user.tag} was unbanned***`)
					.setColor("GREEN");
				message.channel.send(unbanEmbed);
				if (channel) {
					const unbanLogEmbed = new MessageEmbed();
					if (userAvatar) {
						unbanLogEmbed
							.setAuthor("Member Unbanned", userAvatar)
							.setThumbnail(userAvatar);
					} else {
						unbanLogEmbed.setAuthor("Member Unbanned");
					}
					unbanLogEmbed
						.setColor("GREEN")
						.setTimestamp()
						.addField("User", `<@${user.id}> ${user.tag}`)
						.addField("Unbanned By", `<@${message.author.id}>`);
					channel.send(unbanEmbed);
				}
			});
		} catch (err) {
			console.log(err);
		}
	}
}
