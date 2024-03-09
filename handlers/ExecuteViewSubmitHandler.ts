import {
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IUIKitResponse, UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { BasicDemoApp } from '../BasicDemoApp';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { UtilityEnum } from '../enums/UtilityEnum';
import { sendMessage } from '../lib/sendMessage';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { messageHeaderBlock } from '../blocks/UtilityBlock';

export class ExecuteViewSubmitHandler {
    // public async executor(
    //     context: UIKitViewSubmitInteractionContext,
    //     read: IRead,
    //     http: IHttp,
    //     persistence: IPersistence,
    //     modify: IModify,
    //     logger?: ILogger
    // ) {
    //     return {
    //         success: true,
    //     };
    // }

    constructor(
        private readonly app: BasicDemoApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly persis: IPersistence,
        private readonly modify: IModify,
        private readonly context: UIKitViewSubmitInteractionContext,
    ) {}

    public async executor(): Promise<IUIKitResponse> {
        const data = this.context.getInteractionData();
        this.app.getLogger().info('View: ', data);
        const {user, view, triggerId, actionId} = data;
        const appSender = (await this.read.getUserReader().getAppUser()) as IUser;
        const appId = appSender.appId;
        // const roomStr = this.read.getEnvironmentReader().getSettings().getValueById('GENERAL');
        const roomStr = (this.context.getInteractionData().room) as IRoom;

        this.app.getLogger().info('appSender: ', appSender);
        this.app.getLogger().info('user: ', user);
        // this.app.getLogger().info('Modify: ', this.modify.getCreator());
        this.app.getLogger().info('RoomStr: ', roomStr);

        const messageId = (this.context.getInteractionData().view.submit?.value) as string;
        this.app.getLogger().info('MessageId: ', messageId);
        let room;
        if (messageId) {
            room = await this.read.getMessageReader().getRoom(messageId);
            // room = (await this.read.getRoomReader().getById("GENERAL")) as IRoom;
        }
        this.app.getLogger().info('Room: ', room);


        // if (!roomStr) {
        //     return this.context.getInteractionResponder().errorResponse();
        // }

        try {
            switch(view.id) {
                case UtilityEnum.MESSAGE_MODAL_ID:
                    // await sendMessage(this.modify, room, user, 'Custom Message');
                    const message = await this.modify.getUpdater().message(messageId, appSender);
                    const msgHeaderBlock = await messageHeaderBlock();
                    message.setEditor(user).setRoom(room);
                    message.setBlocks(msgHeaderBlock);
                    await this.modify.getUpdater().finish(message);
                    return this.context.getInteractionResponder().successResponse();

                default:
                    return this.context.getInteractionResponder().successResponse();
            }

        } catch (error) {
            console.error(error);
            return this.context.getInteractionResponder().errorResponse();
        }
    }
}
