import { IHttp, ILogger, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { BasicDemoApp } from '../BasicDemoApp';
import { IUIKitResponse, UIKitActionButtonInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { UtilityEnum } from '../enums/UtilityEnum';
import { randomId } from '../lib/utils';
import { buildHeaderBlock } from '../blocks/UtilityBlock';
import { sendMessage } from '../lib/sendMessage';

export class ExecuteActionButtonHandler {
    constructor(
        private readonly app: BasicDemoApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
        private readonly modify: IModify,
        private readonly logger: ILogger,
    ) {}

    public async run(
        context: UIKitActionButtonInteractionContext
    ): Promise<IUIKitResponse> {
        const { buttonContext, actionId, triggerId, user, room, message } = context.getInteractionData();

        try {
            switch (actionId) {
                case UtilityEnum.CREATE_BASIC_MESSAGE_BOX_ACTION_ID:
                    const room = context.getInteractionData().room;
                    const sender = context.getInteractionData().user;
                    const appId = this.app.getID()
                    const data = context.getInteractionData();

                    if (room) {
                        const endpoints =
                            this.app.getAccessors().providedApiEndpoints;
                        const basicEndpoint = endpoints[0];
                        const randomMessageId = randomId();
                        const messageURL = `${basicEndpoint.computedPath}?id=${randomMessageId}`;
                        const appUser = (await this.read
                            .getUserReader()
                            .getAppUser())!;

                        const headerBlock = await buildHeaderBlock(
                            sender.username,
                            messageURL,
                            appId,
                            undefined
                        );
                    //     // const attachments = [
                    //     //     {
                    //     //         collapsed: true,
                    //     //         color: "#00000000",
                    //     //         imageUrl: defaultPreview,
                    //     //     },
                    //     // ];
                        await sendMessage(
                            this.modify,
                            room,
                            appUser,
                            `This is for testing - success`,
                            headerBlock
                        );
                    //     // storeBoardRecord(
                    //     //     this.persistence,
                    //     //     room.id,
                    //     //     randomBoardId,
                    //     //     {
                    //     //         elements: [],
                    //     //         appState: {},
                    //     //         files: [],
                    //     //     },
                    //     //     messageId,
                    //     //     "",
                    //     //     "Untitled Whiteboard",
                    //     //     "",
                    //     //     "Public"
                    //     // );
                    }
                    break;

                default:
                    break;
                // case 'my-action-id-message':
                //     const blockBuilder = this.modify.getCreator().getBlockBuilder();

            }
            return context.getInteractionResponder().successResponse();

        //     if (actionId === "my-action-id-message") {
        //     const blockBuilder = this.modify.getCreator().getBlockBuilder();
        //     const text =
        //         `We received your interaction, thanks!\n` +
        //         `**Action ID**:  ${actionId}\n` +
        //         `**Room**:  ${room.displayName || room.slugifiedName}\n` +
        //         `**Room Type**:  ${room.type}\n` +
        //         `**Message ID**:  ${message?.id}\n` +
        //         `**Text**:  ${message?.text}\n` +
        //         `**Sender**:  ${message?.sender.username} at ${message?.createdAt}\n` +
        //         `**Total Messages at room**: ${room.messageCount}`;
        //     // logging the message using app logger
        //     this.logger.info(text);
        //     // loggin the message to stdout
        //     console.log(text);
        //     // passing it to the Block
        //     blockBuilder.addSectionBlock({
        //         text: blockBuilder.newMarkdownTextObject(text),
        //     });
        //     // let's open a modal using openModalViewResponse with all those information
        //     return context.getInteractionResponder().openModalViewResponse({
        //         title: blockBuilder.newPlainTextObject(
        //             "Button Action on a Message!"
        //         ),
        //         blocks: blockBuilder.getBlocks(),
        //     });
        // }

        // if (actionId === "my-action-id-room") {
        //     const blockBuilder = this.modify.getCreator().getBlockBuilder();

        //     let text = `${actionId} was clicked!`;
        //     // logging the message using app logger
        //     this.logger.info(text);
        //     // loggin the message to stdout
        //     console.log(text);
        //     // let's open a Contextual Bar using openContextualBarViewResponse, instead of a modal
        //     return context
        //         .getInteractionResponder()
        //         .openContextualBarViewResponse({
        //             title: blockBuilder.newPlainTextObject(
        //                 "Button Action on a Room"
        //             ),
        //             blocks: blockBuilder
        //                 .addSectionBlock({
        //                     text: blockBuilder.newPlainTextObject(
        //                         "We received your interaction, thanks!"
        //                     ),
        //                 })
        //                 .getBlocks(),
        //         });
        // }

        // return context.getInteractionResponder().successResponse();

        } catch (err) {
            console.log(err);
            return context.getInteractionResponder().errorResponse();
        }
    }
}
