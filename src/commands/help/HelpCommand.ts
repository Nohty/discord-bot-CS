import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class HelpCommand extends BaseCommand {
	constructor() {
		super("help", "Shows help about the commands.", []);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!args[0]) {
			message.channel.send(`Main help page (in development)`);
		} else {
			const command = client.commands.get(args[0]);
			if (!command) {
				message.channel.send(`${args[0]} is not a command`);
			} else {
				message.channel.send(`Help page for ${args[0]} (in development)`);
			}
		}
	}
}
