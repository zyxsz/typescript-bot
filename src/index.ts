import { config } from 'dotenv'
import { BotClient } from './Client';
import "reflect-metadata";
import * as Discord from "discord.js"

import { createConnection } from "typeorm";

config()

const client = new BotClient({disableMentions: 'everyone'},{ Token: process.env.TOKEN })

client.start()