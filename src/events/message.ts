import * as Discord from "discord.js"

import { getRepository } from "typeorm";

import { Event } from "./index";

export default class MessageEvent implements Event {
    constructor() {
        this.name = "message"
    }

    name: string;

    async run(client, message: Discord.Message): Promise<void> {
        if (message.author.bot) return;
        const prefix = "+";
        if (message == null) return;
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.member)return;

        if (message.content.indexOf(prefix) !== 0) return;
        if (!message.content.startsWith(prefix)) return;

        let args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g) || [" "];
        let cmd = args.shift().toLowerCase()

        if (cmd.length === 0) return;
        let command = client.Commands.get(cmd);
        if (!command) command = client.Commands.get(client.Aliases.get(cmd));

        if (command)
            command.run(client, message, args);
    }
}