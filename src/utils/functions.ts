import fs from "fs";
import path from "path";
import chalk from "chalk";

export function logError(error: any): void {
    const errorLogPath = path.join(__dirname, "..", "logs", "error.log");
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ${error.stack || error}\n`;

    fs.appendFile(errorLogPath, errorMessage, (err) => {
        if (err) console.error(chalk.redBright("Failed to write error log:", err));
    });
}

export function logWarning(warning: any): void {
    const warningLogPath = path.join(__dirname, "..", "logs", "warning.log");
    const timestamp = new Date().toISOString();
    const warningMessage = `[${timestamp}] ${warning.stack || warning}\n`;

    fs.appendFile(warningLogPath, warningMessage, (err) => {
        if (err) console.error(chalk.redBright("Failed to write warning log:", err));
    });
} 