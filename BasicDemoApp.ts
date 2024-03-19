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
import { IAppInfo, RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import {
    IUIKitInteractionHandler,
    IUIKitResponse,
    UIKitActionButtonInteractionContext,
    UIKitBlockInteractionContext,
    UIKitViewSubmitInteractionContext
} from '@rocket.chat/apps-engine/definition/uikit';
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
import { sendDirectMessage } from './lib/sendDirectMessage';
import { IMessage, IPostMessageSent } from '@rocket.chat/apps-engine/definition/messages';
import { MessagePersistence } from './persistence/MessagePersistence';

export class BasicDemoApp extends App implements IUIKitInteractionHandler, IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    // public async executePostMessageSent(
    //     message: IMessage,
    //     read: IRead,
    //     http: IHttp,
    //     persistence: IPersistence,
    //     modify: IModify
    // ): Promise<void> {
    //         const association = new RocketChatAssociationRecord(
    //             RocketChatAssociationModel.MISC,
    //             'message_count'
    //         );
    //         const persis = read.getPersistenceReader();

    //         try {
    //             let count = 0;
    //             const record = await persis.readByAssociation(association);
    //             // await persis.read('message_count');
    //             console.log('Record: ', record);
    //             this.getLogger().info(record);

    //             if (record?.count) {
    //                 count = record.count;
    //             }

    //             await persistence.createWithAssociation({count: ++count || 0}, association);
    //         } catch (err) {
    //             console.error(err);
    //             return this.getLogger().info(err);

    //         }
    // }

    public async executePostMessageSent(
        message: IMessage,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<void> {
        if (!message.id) {
            console.error('Message ID is undefined.');
            return; // Exit the function if message ID is undefined
        }

        const room = message.room;
        const msg = message.text;
        // const messageId = modify.getCreator().startMessage().setSender()
        // const room = read.getRoomReader().getById(roomId);
        let messageStorage = new MessagePersistence(
            persistence,
            this.getAccessors().reader.getPersistenceReader()
        );
        console.log('Messaage: ', message);

        const messageAdded = await messageStorage.persist(room, message.id);
        if (messageAdded) {
            console.log('Message Saved to Persistence storage');
        }

        let data = await messageStorage.findAll();
        if (data) {
            console.log('Data from storage: ', data);
            this.getLogger().info('Data from storage: ', data);
        }
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        // if (typeof TextDecoder === 'undefined') {
        //     global.TextDecoder = require('util').TextDecoder;
        // }
        const handler = new ExecuteBlockActionHandler(
            this,
            read,
            modify,
            http,
            persis,
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
        modify: IModify,
    ) {
        return new ExecuteViewSubmitHandler(
            this,
            read,
            http,
            persistence,
            modify,
            context,
        ).executor();
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
