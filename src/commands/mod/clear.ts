import * as Discord from "discord.js"

import { Command } from "../index";
export default class ClearCommand implements Command {

    constructor() {
        this.aliases = ["limpar"];
        this.command = "clear";
        this.category = "Moderation";
    }

    command: string;
    aliases: Array<string>;
    category: string;

    async run(clientInstance: Discord.Client, message: Discord.Message, args: string[]): Promise<any> {
        try {
            if(message.deletable){
                message.delete()
            }
            let messagesToDelete: number = await parseInt(args[0]);

            if (!messagesToDelete) return await message.reply("❌ ->  Quantia invalida, utilize: `+clear <quantidade>`").then(e => e.delete({ timeout: 6000 }))

            if (messagesToDelete > 100) {
                messagesToDelete = 100
            }

            message.channel.bulkDelete(messagesToDelete).then(co => {
                return message.reply(`✅ ->  Foram apagadas \`${co.size}\``).then(e => e.delete({ timeout: 6000 }))
            }).catch(err=>{
                return message.reply(`❌ ->  Não foi possivel apagar as mensagens.\n \`Erro: ${err}\``).then(e => e.delete({ timeout: 6000 }))
            })
        } catch (error) {
            console.log(error);
        }
    }
}