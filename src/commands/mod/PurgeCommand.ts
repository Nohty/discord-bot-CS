import { Message, MessageEmbed, TextChannel } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
import { modLogChannelId } from "../../utils/var";

export default class PurgeCommand extends BaseCommand {
	constructor() {
		super(
			"purge",
			"mod",
			["clear"],
			"Removes multiple messages from a channel (default 5).",
			[]
		);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (message.channel.type === "dm") {
			message.channel.send("You can not use this command in dm.");
			return;
		}
		if (!message.member?.hasPermission("MANAGE_MESSAGES")) {
			message.reply("I am sorry, but you can not use this command.");
			return;
		}
		if (!message.guild?.me?.hasPermission("MANAGE_MESSAGES")) {
			message.reply("I am sorry, but I can not remove messages.");
			return;
		}
		let amount = 5;
		if (args[0]) {
			amount = parseInt(args[0]);
			if (isNaN(amount)) {
				message.reply(`\`${args[0]}\` is not a number!`);
				return;
			}
			if (amount > 500) {
				message.reply(
					"The maximum amount of messages that you can delete is `500`"
				);
				return;
			} else if (amount < 1) {
				message.reply(
					"The minimum amount of messages that you can delete is `1`"
				);
				return;
			}
		}
		amount++;
		const removedAmount = amount;
		try {
			while (amount > 0) {
				if (amount - 100 >= 0) {
					message.channel.bulkDelete(100);
					amount -= 100;
				} else {
					message.channel.bulkDelete(amount);
					amount = 0;
				}
			}
		} catch (err) {
			message.reply("An error occurred when removing the messages");
			return;
		}
		const channel = message.guild.channels.cache.get(
			modLogChannelId
		) as TextChannel;
		if (channel) {
			const purgeLogEmbed = new MessageEmbed()
				.setDescription(
					`${removedAmount} Messages purged in ${message.channel.name} by <@${message.author.id}>`
				)
				.setColor("RED")
				.setTimestamp();
			channel.send(purgeLogEmbed);
		}
	}
}
