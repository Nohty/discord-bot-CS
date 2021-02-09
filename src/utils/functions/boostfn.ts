import { GuildMember, MessageEmbed, TextChannel } from "discord.js";

export default function sendBoostMessage(
	oldMember: GuildMember,
	newMember: GuildMember,
	boostRoleId: string,
	channelId: string
): boolean {
	if (!oldMember.roles.cache.get(boostRoleId)) {
		if (newMember.roles.cache.get(boostRoleId)) {
			const channel = newMember.guild.channels.cache.get(
				channelId
			) as TextChannel;
			if (channel) {
				const boostEmbed = new MessageEmbed().setColor("#f47fff");
				const avatar = newMember.user.avatarURL();
				if (avatar) {
					boostEmbed.setAuthor(
						`🔮 ${newMember.user.username} has boosted the server!`,
						avatar
					);
				} else {
					boostEmbed.setAuthor(
						`🔮 ${newMember.user.username} has boosted the server!`
					);
				}
				channel.send(boostEmbed);
				return true;
			}
		}
	}
	return false;
}
