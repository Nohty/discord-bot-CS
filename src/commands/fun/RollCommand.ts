import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import rollDice from "../../utils/functions/dicefn";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class RollCommand extends BaseCommand {
	constructor() {
		super("roll", "fun", ["rolldice"], "Rolls a dice (default 6)", ["roll [amount]"]);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (message.channel.type === "dm") {
			message.channel.send("You can not use this command in dm.");
			return;
		}
		if (args[0]) {
			message.reply(`rolled a ${rollDice(parseInt(args[0]))}`);
		} else {
			message.reply(`rolled a ${rollDice(6)}`);
		}
	}
}
