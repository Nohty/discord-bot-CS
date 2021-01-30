import { Message, MessageEmbed } from "discord.js";
import DiscordClient from "../../client/client";
import BaseCommand from "../../utils/structures/BaseCommand";

export default class HelpCommand extends BaseCommand {
	constructor() {
		super("help", "help", [], "Shows help about the commands.", [
			"help [command | category]",
		]);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (!args[0]) {
			const avatar = client.user?.avatarURL();
			const helpEmbed = new MessageEmbed().setColor("BLUE");
			if (avatar) {
				helpEmbed.setAuthor(`${client.user?.username} Categories`, avatar);
			} else {
				helpEmbed.setAuthor(`${client.user?.username} Categories`);
			}
			let category = getAllCategories(client);
			category.forEach((cat) => {
				if (!(cat === "help")) {
					helpEmbed.addField(cat, `\`${client.prefix}help ${cat}\``, true);
				}
			});
			message.channel.send(helpEmbed);
		} else {
			const command = client.commands.get(args[0]);
			if (!command) {
				const category = getAllCategories(client);
				if (inCategoryList(category, args[0])) {
					const commands = client.commands;
					let helpMessage = "";
					let filterCommands: Array<string> = [];
					commands.forEach((com) => {
						filterCommands.push(com.getName());
					});
					filterCommands = Array.from(new Set(filterCommands));
					filterCommands.forEach((com) => {
						const comm = client.commands.get(com);
						if (comm) {
							if (comm.getCategory() === args[0]) {
								if (helpMessage.length > 0) {
									helpMessage += "\n";
								}
								helpMessage += `\`${client.prefix}help ${comm.getName()}\`\n`;
								helpMessage += `${comm.getDescription()}\n`;
							}
						}
					});
					const helpEmbed = new MessageEmbed()
						.setTitle(`${args[0]} Category`)
						.setDescription(helpMessage)
						.setColor("BLUE");
					message.channel.send(helpEmbed);
				} else {
					message.channel.send(`${args[0]} is not a command or category`);
				}
			} else {
				const helpEmbed = new MessageEmbed()
					.setAuthor(`Command ${command.getName()}`)
					.setColor("BLUE");
				if (command.getDescription().length > 0) {
					helpEmbed.addField("Description", command.getDescription());
				}
				if (command.getCategory().length > 0) {
					helpEmbed.addField("Category", command.getCategory());
				}
				if (command.getAliases().length > 0) {
					let aliases = "";
					command.getAliases().forEach((alias) => {
						if (aliases.length === 0) {
							aliases += `${alias}`;
						} else {
							aliases += `, ${alias}`;
						}
					});
					helpEmbed.addField("Aliases", aliases);
				}
				if (command.getUsage().length > 0) {
					let usage = "";
					command.getUsage().forEach((us) => {
						usage += `\`${us}\`\n`;
					});
					helpEmbed.addField("Usage", usage);
				}
				message.channel.send(helpEmbed);
			}
		}
	}
}

function inCategoryList(list: Array<string>, category: string): boolean {
	for (const item of list) {
		if (item === category) {
			return true;
		}
	}
	return false;
}

function getAllCategories(client: DiscordClient): Array<string> {
	let categories: Array<string> = [];
	const commands = client.commands;
	commands.forEach((command) => {
		if (command.getCategory().length > 0) {
			const com = command.getCategory();
			if (!inCategoryList(categories, com)) {
				categories.push(com);
			}
		}
	});
	return categories;
}
