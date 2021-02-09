// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";
import sendBoostMessage from "../../utils/functions/boostfn";

export default class GuildMemberUpdateEvent extends BaseEvent {
	constructor() {
		super("guildMemberUpdate");
	}

	async run(
		client: DiscordClient,
		oldMember: GuildMember,
		newMember: GuildMember
	) {
		sendBoostMessage(
			oldMember,
			newMember,
			"805040861032218655",
			"808790837378940988"
		);
	}
}
