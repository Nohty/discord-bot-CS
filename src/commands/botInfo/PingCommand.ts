import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class PingCommand extends BaseCommand {
	constructor() {
		super("ping", "botinfo", [], "Displays the Latency.", ["ping"]);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		const m = await message.channel.send("Pong!");
		m.edit(
			`Pong! Latency is \`${
				m.createdTimestamp - message.createdTimestamp
			}ms\`. API Latency is \`${Math.round(client.ws.ping)}ms\`.`
		);
	}
}
