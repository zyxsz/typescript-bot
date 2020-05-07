import * as Discord from "discord.js"

export interface Command {
    command: string,
    aliases: Array<string>,
    category: string,
    run(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<void>
}