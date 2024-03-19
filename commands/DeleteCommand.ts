import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { BasicDemoApp } from '../BasicDemoApp';
import { IRead, IModify, IHttp, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class DeleteCommand implements ISlashCommand {
    public command = "delete-message";
    public i18nParamsExample = "";
    public i18nDescription = "This is delete message command description";
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


    }
}
