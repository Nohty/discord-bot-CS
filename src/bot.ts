import { registerCommands, registerEvents } from "./utils/registry";
import DiscordClient from "./client/client";
require("dotenv").config();
const client = new DiscordClient({});

(async () => {
	client.prefix = process.env.BOT_PREFIX || client.prefix;
	await registerCommands(client, "../commands");
	await registerEvents(client, "../events");
	await client.login(process.env.BOT_TOKEN);
})();
