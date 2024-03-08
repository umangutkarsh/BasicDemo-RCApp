import {
    IAppAccessors,
    IAppInstallationContext,
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IUIKitResponse, UIKitActionButtonInteractionContext, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { ExecuteActionButtonHandler } from './handlers/ExecuteActionButtonHandler';
import { ExecuteViewSubmitHandler } from './handlers/ExecuteViewSubmitHandler';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { sendNotification } from './lib/sendNotification';
import { BasicCommand } from './commands/BasicCommand';
import { ApiSecurity, ApiVisibility } from '@rocket.chat/apps-engine/definition/api';
import { BasicEndpoint } from './endpoints/BasicEndPoint';
import { UtilityEnum } from './enums/UtilityEnum';
import { UIActionButtonContext } from './enums/UIActionButtonContext';
import { ExecuteBlockActionHandler } from './handlers/ExecuteBlockActionHandler';

export class BasicDemoApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
        room: IRoom,
    ): Promise<IUIKitResponse> {
        if (typeof TextDecoder === 'undefined') {
            global.TextDecoder = require('util').TextDecoder;
        }
        const handler = new ExecuteBlockActionHandler(
            this,
            read,
            modify,
            http,
            persis,
            room,
            context,
        );
        return await handler.run();
    }

    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext, //Keep this sequence of parameters
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {

        const handler = new ExecuteActionButtonHandler(
            this,
            read,
            http,
            persistence,
            modify,
            this.getLogger(),
        );
        return await handler.run(context);
    }

    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        return new ExecuteViewSubmitHandler().executor(
            context,
            read,
            http,
            persistence,
            modify,
            this.getLogger()
        );
    }

    public async onInstall(
        context: IAppInstallationContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {
        const room = (await read.getRoomReader().getById("GENERAL")) as IRoom;
        const user = (await read.getUserReader().getAppUser()) as IUser;
        // sendDirectMessage(
        //     context,
        //     read,
        //     modify,
        //     `Basic App Installed Successfully 🎉 \n
        //     *Basic App Commands*
        //     \`/basic m\` - To display a message
        //     \`/basic n\` - To display a notification
        //     \`/basic help\` - To get helper message
        //     \`/basic direct\` - To send a direct message`,
        // )

        await sendNotification(
            modify,
            room,
            user,
            `Basic App Installed Successfully 🎉 \n
            *Basic App Commands*
            \`/basic m\` - To display a message
            \`/basic n\` - To display a notification
            \`/basic help\` - To get helper message
            \`/basic direct\` - To send a direct message`,
        )
    }

    // public async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    //     await configuration.slashCommands.provideSlashCommand(
    //         new BasicCommand(this)
    //     )

    //     await configuration.api.provideApi({
    //         visibility: ApiVisibility.PUBLIC,
    //         security: ApiSecurity.UNSECURE,
    //         endpoints: [new BasicEndpoint(this)],
    //     })
    // }

    public async initialize(
        configurationExtend: IConfigurationExtend,
        environmentRead: IEnvironmentRead
    ): Promise<void> {
        await configurationExtend.slashCommands.provideSlashCommand(
            new BasicCommand(this)
        )

        await configurationExtend.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [new BasicEndpoint(this)],
        });

        configurationExtend.ui.registerButton({
            actionId: UtilityEnum.CREATE_BASIC_MESSAGE_BOX_ACTION_ID,
            labelI18n: "create_message",
            context: UIActionButtonContext.MESSAGE_BOX_ACTION,
        });
    }
}
