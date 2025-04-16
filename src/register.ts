import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { logError } from "./utils/functions";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const commands: any[] = [];

// Load context menu commands
const contextMenuCommandsPath = path.join(__dirname, "commands", "context_menu");
const contextMenuCommandFiles = fs.readdirSync(contextMenuCommandsPath).filter((file) => file.endsWith(".ts"));

for (const file of contextMenuCommandFiles) {
    const filePath = path.join(contextMenuCommandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    } else {
        if (!("data" in command) && !("execute" in command))
            console.log(chalk.yellowBright(`[WARNING] The command at "${filePath}" is missing a required "data" and "execute" property.`));
        else if (!("data" in command))
            console.log(chalk.yellowBright(`[WARNING] The command at "${filePath}" is missing a required "data" property.`));
        else if (!("execute" in command))
            console.log(chalk.yellowBright(`[WARNING] The command at "${filePath}" is missing a required "execute" property.`));
    }
}

// Load slash commands
const slashCommandsPath = path.join(__dirname, "commands", "slash");
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter((file) => file.endsWith(".ts"));

for (const file of slashCommandFiles) {
    const filePath = path.join(slashCommandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
    } else {
        if (!("data" in command) && !("execute" in command))
            console.log(chalk.yellowBright(`[WARNING] The command at "${filePath}" is missing a required "data" and "execute" property.`));
        else if (!("data" in command))
            console.log(chalk.yellowBright(`[WARNING] The command at "${filePath}" is missing a required "data" property.`));
        else if (!("execute" in command))
            console.log(chalk.yellowBright(`[WARNING] The command at "${filePath}" is missing a required "execute" property.`));
    }
}

const rest = new REST().setToken(process.env.BOT_TOKEN!);

(async () => {
    try {
        console.log(chalk.cyanBright(`Started refreshing ${commands.length} application commands.`));

        const data = await rest.put(
            Routes.applicationCommands(process.env.APPLICATION_ID!),
            { body: commands }
        );

        console.log(chalk.greenBright(`Successfully reloaded ${(data as any[]).length} application commands.`));
    } catch (error) {
        logError(error);
    }
})(); 