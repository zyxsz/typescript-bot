import * as fs from "fs";
import * as Path from "path";

import { Command } from "./commands/index";
import { Event } from "./events/index";

import { Client, Collection,ClientOptions } from 'discord.js'

interface Settings{
    Token: string,
}

export class BotClient extends Client {
    private Commands: Collection<any, any>
    private Aliases: Collection<any, any>
    private settings: Settings;

    constructor(Botsettings:ClientOptions,settings:Settings) {
        super(Botsettings)
        this.settings = settings
        this.Commands = new Collection()
        this.Aliases = new Collection()
    }


    private async registerCommands(): Promise<any> {
        try {
            console.log('-=-=-=-=-=-=-=-= Commands =-=-=-=-=-=-=-=-')
            fs.readdirSync(Path.join(__dirname, "commands")).forEach((dir: any) => {
                if (dir === "index.ts") return
                const commands = fs.readdirSync(Path.join(__dirname, "commands", dir)).filter(file => file.endsWith(".ts") && !file.startsWith("index"));

                for (let file of commands) {
                    const requireCommand = require(`./commands/${dir}/${file}`).default
                    let pull = new requireCommand() as Command;
                    if (pull.command) {
                        this.Commands.set(pull.command, pull);
                        console.log(`[${file}] ✅ -> Comando carregado com sucesso`)
                    } else {
                        console.log(`[${file}] ❌ -> Comando invalidio`)
                        continue;
                    }

                    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias: any) => this.Aliases.set(alias, pull.command));
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    private async registerEvents(): Promise<any> {
        try {
            console.log('-=-=-=-=-=-=-=-= Events =-=-=-=-=-=-=-=-')
            fs.readdir(Path.resolve(__dirname, "events"), async (error, files) => {
                for (const event of files) {
                    if (event !== "index.ts") {
                        const requiredEvent = require(Path.resolve(__dirname, "events", event)).default;
                        const eventClass = new requiredEvent() as Event;
                        this.on(eventClass.name, eventClass.run.bind(null, this));
                        console.log(`[${event}] ✅ -> Evento carregado com sucesso`);
                    }
                }
            });
        } catch (error) {
            console.error(`❌ -> Não foi possivel carregar os eventos`,`Error: ${error}`)
        }
    }

    async start(): Promise<void> {
        process.on("unhandledRejection", error => {
            console.error(error);
        });

        await this.login(this.settings.Token)
        
        await this.registerCommands();
        await this.registerEvents();
    }
}