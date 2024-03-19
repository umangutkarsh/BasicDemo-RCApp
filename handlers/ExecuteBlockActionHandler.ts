import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { BasicDemoApp } from '../BasicDemoApp';
import { IUIKitResponse, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { UtilityEnum } from '../enums/UtilityEnum';
import { MessageModal } from '../modals/MessageModal';
import { sendMessage } from '../lib/sendMessage';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SettingsModal } from '../modals/SettingsModal';
import { NotifyModal } from '../modals/NotifyModal';
import { GetMessageModal } from '../modals/GetMessageModal';

export class ExecuteBlockActionHandler {
   constructor(
      private readonly app: BasicDemoApp,
      private readonly read: IRead,
      private readonly modify: IModify,
      private readonly http: IHttp,
      private readonly persistence: IPersistence,
      private readonly context: UIKitBlockInteractionContext,
   ) {}

   public async run(): Promise<IUIKitResponse> {
      const data = this.context.getInteractionData();
      const roomStr = this.context.getInteractionData().room;
      console.log('RoomStr: ', roomStr);

      if (!roomStr) {
        return this.context.getInteractionResponder().errorResponse();
      }
      try {
        //  this.app.getLogger().info(data);
        const {
            actionId,
            triggerId,
            user,
            room,
            value,
            message,
            container,
        } = data;

        const messageId = data?.message?.id;
        const appId = data?.appId;
        const appSender: IUser = (await this.read.getUserReader().getAppUser()) as IUser;
        this.app.getLogger().info(actionId);
        console.log('ACTIONId: ', actionId);


        // if (messageId) {
        //             // const modal = await MessageModal(appId, messageId);
        //             // // await Promise.all([
        //             // //     this.modify.getUiController().openSurfaceView(
        //             // //         modal,
        //             // //         {
        //             // //             triggerId,
        //             // //         },
        //             // //         user,
        //             // //     ),
        //             // // ]);
        //             await sendMessage(this.modify, this.room, appSender, `I have sent a message`);
        //         }

        switch(actionId) {
            case UtilityEnum.MESSAGE_BUTTON_ACTION_ID:
                if (messageId) {
                    const modal = await MessageModal(this.app, appId, messageId);
                    await Promise.all([
                        this.modify.getUiController().openSurfaceView(
                            modal,
                            {
                                triggerId,
                            },
                            user,
                        ),
                    ]);
                    // await sendMessage(this.modify, room, appSender, `I have sent a message`);
                    return this.context.getInteractionResponder().successResponse();
                }

            case UtilityEnum.NOTIFY_BUTTON_ACTION_ID:
                if (messageId) {
                    const modal = await NotifyModal(this.app, appId,messageId);
                    await Promise.all([
                        this.modify.getUiController().openSurfaceView(
                            modal, { triggerId }, user,
                        ),
                    ]);
                    return this.context.getInteractionResponder().successResponse();
                }

            case UtilityEnum.SETTINGS_BUTTON_ACTION_ID:
                if (messageId) {
                    const modal = await SettingsModal(appId, messageId);
                    await Promise.all([
                        this.modify.getUiController().openSurfaceView(
                            modal,
                            {
                                triggerId,
                            },
                            user
                        ),
                    ]);
                }
                return this.context.getInteractionResponder().successResponse();

            case UtilityEnum.GET_MESSAGES_BUTTON_ACTION_ID:
                if (messageId) {
                    const modal = await GetMessageModal(
                        this.app,
                        appId,
                        messageId,
                        this.read,
                        roomStr,
                        this.persistence
                    );
                    await Promise.all([
                        this.modify.getUiController().openSurfaceView(
                            modal,
                            {
                                triggerId,
                            },
                            user,
                        ),
                    ]);
                }
                return this.context.getInteractionResponder().successResponse();

            default:
                // await sendMessage(this.modify, this.room, appSender, 'Not executed');
                return this.context.getInteractionResponder().successResponse();

        }
        // return this.context.getInteractionResponder().successResponse();
      } catch (error) {
         console.error(error);
         return this.context.getInteractionResponder().errorResponse();
      }
   }
}
