import { User } from "discord.js";
import DiscordClient from "../../client/client";

export default function getUser(
	client: DiscordClient,
	mention: string
): User | undefined {
	if (!mention) return;
	if (mention.startsWith("<@") && mention.endsWith(">")) {
		mention = mention.slice(2, -1);
		if (mention.startsWith("!")) {
			mention = mention.slice(1);
		}
	}
	return client.users.cache.get(mention);
}
