import {getRepository} from "typeorm";
import * as Discord from "discord.js";

import {IEvent} from './index'

export default class ReadyEvent implements IEvent {
    constructor() {
        this.name = "ready"
    }
    name: string;
    async run(client): Promise<void> {
        await console.log(`I am ready! ${client.user.tag}`);
    }
}