import { Client, CommandInteraction, Message, Collection } from "discord.js";

export interface Command {
    name: string;
    execute: (client: Client, message: Message, args: string[]) => Promise<void>;
}

export interface SlashCommand {
    data: any;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface Event {
    name: string;
    once?: boolean;
    execute: (client: Client, ...args: any[]) => Promise<void>;
}

// Extend Discord.js Client with our custom properties
declare module "discord.js" {
    interface Client {
        contextMenuCommands: Collection<string, SlashCommand>;
        slashCommands: Collection<string, SlashCommand>;
        prefixCommands: Collection<string, Command>;
        contextMenuCommandsCooldowns: Collection<string, Collection<string, number>>;
        slashCommandsCooldowns: Collection<string, Collection<string, number>>;
        prefixCommandsCooldowns: Collection<string, Collection<string, number>>;
    }
} 