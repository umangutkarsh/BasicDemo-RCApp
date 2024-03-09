import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { BasicDemoApp } from '../BasicDemoApp';
import { IRead, IModify, IHttp, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { sendNotification } from '../lib/sendNotification';
import { sendMessage } from '../lib/sendMessage';
import { sendDirectMessage } from '../lib/sendDirectMessage';
import { getMessageButton } from '../lib/getMessageButton';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class BasicCommand implements ISlashCommand {
    public command = "basic-demo";
    public i18nParamsExample = "";
    public i18nDescription = "This is basic command description";
    public providesPreview = false;
    constructor(private readonly app: BasicDemoApp) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const [subCommands] = context.getArguments();
        const room = context.getRoom();
        const sender = context.getSender();
        const appUser = (await read.getUserReader().getAppUser()) as IUser;


        // if (!Array.isArray(command)) {
        //     return;
        // }

        this.app.getLogger().info(`Slash command ${this.command} initiated. Trigger id: ${context.getTriggerId()}, with arguments ${context.getArguments()}`)
        // this.app.getLogger().info(`Modify: `, modify);
        this.app.getLogger().info(`Room: `, room);
        this.app.getLogger().info(`Sender: `, sender);

        read.getUserReader();
        const display_message =  `*Basic App Commands*
            \`/basic m\` - To display a message
            \`/basic n\` - To display a notification
            \`/basic help\` - To get helper message
            \`/basic direct\` - To send a direct message`

        if (!subCommands) {
            var message = `No subcommands!\n ${display_message}`
            await sendNotification(modify, room, sender, message);
        } else {
            switch (subCommands) {
                case "m":
                case "msg":
                case "message":
                    message = `*This is a message.* \nEveryone in this channel can read this\n`;
                    await sendMessage(modify, room, appUser, message);
                    break;

                case "n":
                case "notify":
                case "notification":
                    message = `*This is a notification.*\nIf you reload, It'll be gone. This is different than a message`;
                    await sendNotification(modify, room, sender, message);
                    break;

                case "d":
                case "direct":
                case "direct-message":
                    message = `*This is a direct message.*\nOnly you can view this.`;
                    await sendDirectMessage(context, read, modify, message);
                    break;

                case "h":
                case "help":
                    await sendNotification(modify, room, sender, display_message);
                    break;

                case "button":
                    await getMessageButton(this.app, context, read, modify, http, persis);
                    break;

                default:
                    message = `Invalid sub-command! \n${display_message}\n`
                    await sendNotification(modify, room, sender, message);
                    break;
            }
        }
    }
}
