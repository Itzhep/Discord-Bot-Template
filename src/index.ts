import { Client, GatewayIntentBits, ActivityType, Collection } from "discord.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { logError, logWarning } from "./utils/functions";
import { Command, SlashCommand } from "./types";

// Load environment variables
dotenv.config();

// Import config
import config from "../config.json";

// Discord Client Constructor
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    presence: {
        activities: [
            {
                name: `Github.com/iTzArshia`,
                type: ActivityType.Watching,
            },
        ],
        status: "online",
    },
});

// Initialize collections with proper types
client.contextMenuCommands = new Collection<string, SlashCommand>();
client.slashCommands = new Collection<string, SlashCommand>();
client.prefixCommands = new Collection<string, Command>();
client.contextMenuCommandsCooldowns = new Collection<string, Collection<string, number>>();
client.slashCommandsCooldowns = new Collection<string, Collection<string, number>>();
client.prefixCommandsCooldowns = new Collection<string, Collection<string, number>>();

// Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if ("name" in event && "execute" in event) {
        const callBack = (...args: any[]) => event.execute(client, ...args);
        if (event.once) {
            client.once(event.name, callBack);
        } else {
            client.on(event.name, callBack);
        }
    } else {
        if (!("name" in event) && !("execute" in event))
            console.log(chalk.yellowBright(`[WARNING] :: The event at "${filePath}" is missing a required "name" and "execute" property.`));
        else if (!("name" in event))
            console.log(chalk.yellowBright(`[WARNING] :: The event at "${filePath}" is missing a required "name" property.`));
        else if (!("execute" in event))
            console.log(chalk.yellowBright(`[WARNING] :: The event at "${filePath}" is missing a required "execute" property.`));
    }
}

// Command Handlers
const commandTypes = ["contextMenu", "slash", "prefix"] as const;

for (const type of commandTypes) {
    const commandsPath = path.join(__dirname, "commands", type === "contextMenu" ? "context_menu" : type);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client[`${type}Commands`].set(command.data.name, command);
        } else if ("name" in command && "execute" in command) {
            client[`${type}Commands`].set(command.name.toLowerCase(), command);
        } else {
            console.log(chalk.yellowBright(`[WARNING] :: The command at "${filePath}" is missing required properties.`));
        }
    }
}

// Anti-Crash
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    console.error(chalk.redBright("[Anti Crash] :: Unhandled Rejection/Catch"));
    logError(reason);
});

process.on("uncaughtException", (error: Error, origin: string) => {
    console.error(chalk.redBright("[Anti Crash] :: Uncaught Exception/Catch"));
    logError(error);
});

process.on("warning", (warning: Error) => {
    console.warn(chalk.yellowBright("[Anti Crash] :: Warning"));
    logWarning(warning);
});

process.on("SIGINT", () => {
    console.log(chalk.cyanBright("[Process] :: Received SIGINT. Shutting down gracefully..."));
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log(chalk.cyanBright("[Process] :: Received SIGTERM. Shutting down gracefully..."));
    process.exit(0);
});

// Login to Discord Client
client.login(process.env.BOT_TOKEN); 