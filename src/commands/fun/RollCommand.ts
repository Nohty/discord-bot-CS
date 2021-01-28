import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import rollDice from "../../utils/functions/dicefn";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class RollCommand extends BaseCommand {
	constructor() {
		super("roll", "Rolls a dice", ["rolldice"]);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (args[0]) {
			message.reply(`rolled a ${rollDice(parseInt(args[0]))}`);
		} else {
			message.reply(`rolled a ${rollDice(6)}`);
		}
	}
}
