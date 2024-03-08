import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { BasicDemoApp } from '../BasicDemoApp';
import { IUIKitResponse, UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { UtilityEnum } from '../enums/UtilityEnum';
import { MessageModal } from '../modals/MessageModal';
import { sendMessage } from '../lib/sendMessage';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

export class ExecuteBlockActionHandler {
   constructor(
      private readonly app: BasicDemoApp,
      private readonly read: IRead,
      private readonly modify: IModify,
      private readonly http: IHttp,
      private readonly persistence: IPersistence,
      private readonly room: IRoom,
      private readonly context: UIKitBlockInteractionContext,
   ) {}

   public async run(): Promise<IUIKitResponse> {
      const data = this.context.getInteractionData();
    //   if (!roomStr) {
    //     return this.context.getInteractionResponder().errorResponse();
    //   }
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
        const appSender = (await this.read.getUserReader().getAppUser()) as IUser;
        this.app.getLogger().info(actionId);

        switch(actionId) {
            case UtilityEnum.MESSAGE_BUTTON_ACTION_ID:
                // if (messageId) {
                    // const modal = await MessageModal(appId, messageId);
                    // // await Promise.all([
                    // //     this.modify.getUiController().openSurfaceView(
                    // //         modal,
                    // //         {
                    // //             triggerId,
                    // //         },
                    // //         user,
                    // //     ),
                    // // ]);
                    await sendMessage(this.modify, this.room, appSender, `I have sent a message`);
                // }
                break;

            default:
                await sendMessage(this.modify, this.room, appSender, 'Not executed');
                break;
        }
        return this.context.getInteractionResponder().successResponse();
      } catch (error) {
         console.error(error);
         return this.context.getInteractionResponder().errorResponse();
      }
   }
}
