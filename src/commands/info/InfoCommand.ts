import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";
const pk = require("../../../package");

export default class VersionCommand extends BaseCommand {
	constructor() {
		super("info", "info", [], "Get information about the bot.", ["info"]);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const avatar = client.user?.avatarURL();
		const infoEmbed = new MessageEmbed();
		if (avatar) {
			infoEmbed.setAuthor(client.user?.username, avatar);
		} else {
			infoEmbed.setAuthor(client.user?.username);
		}
		infoEmbed
			.setColor("BLUE")
			.addField("Version", pk.version, true)
			.addField("Library", "discord.js", true)
			.addField("Language", "Typescript", true)
			.addField("Creator", pk.owners[0], true)
			.addField("Servers", client.guilds.cache.size, true)
			.addField("Users", client.users.cache.size, true);
		const uptimeStr = getUptimeStr(client);
		if (uptimeStr) {
			infoEmbed.setFooter(`Uptime${uptimeStr}`);
		}
		message.channel.send(infoEmbed);
	}
}

function getUptimeStr(client: DiscordClient): string | undefined {
	let totalSeconds = client.uptime;
	if (totalSeconds) {
		totalSeconds = totalSeconds / 1000;
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		let returnString = "";
		if (days > 0) {
			returnString += ` ${days} days,`;
		}
		if (hours > 0) {
			returnString += ` ${hours} hrs,`;
		}
		if (minutes > 0) {
			returnString += ` ${minutes} min,`;
		}
		if (seconds > 0) {
			returnString += ` ${seconds} sec`;
		}
		return returnString;
	}
	return;
}
