import { IPersistence, IRead, IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { BasicDemoApp } from '../BasicDemoApp';
import { Block } from '@rocket.chat/ui-kit';
import { getButton, getDividerBlock, getSectionBlock } from '../helpers/blockBuilder';
import { UtilityEnum } from '../enums/UtilityEnum';
import { UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { MessagePersistence } from '../persistence/MessagePersistence';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

export async function GetMessageModal(
    app: BasicDemoApp,
    appId: string,
    messageId: string,
    read: IRead,
    room: IRoom,
    persis: IPersistence,
): Promise<IUIKitSurfaceViewParam> {
    const block: Block[] = [];

    let messageStorage = new MessagePersistence(
        persis,
        app.getAccessors().reader.getPersistenceReader()
    );
    const storedIds = await messageStorage.findByName(room);

    for (let i=0 ; i<storedIds.length ; i++) {
        const message = await read.getMessageReader().getById(storedIds[i]);
        console.log('MessageDeets: ', message);

        let dividerBlock = getDividerBlock();
        block.push(dividerBlock);

        if (message?.text) {
            let messageTextBlock = getSectionBlock(`Message: ` + message?.text);
            block.push(messageTextBlock);
        }

        if (message?.room.creator.username && message?.room.creator.name) {
            let messageCreatorBlock = getSectionBlock(
                `Sent By: ` + message?.room.creator.name + ` (` + message?.room.creator.username + `)`
            );
            block.push(messageCreatorBlock);
        }
    }

    let closeButton = getButton(
        "Close",
        UtilityEnum.CLOSE_BLOCK_ID,
        UtilityEnum.CLOSE_ACTION_ID,
        appId,
        "",
        undefined,
    );

    // let sendButton = getButton(
    //     UtilityEnum.SEND,
    //     UtilityEnum.SEND_BLOCK_ID,
    //     UtilityEnum.SEND_ACTION_ID,
    //     appId,
    //     messageId,
    //     ButtonStyl.PRIMARY,
    // );

    const value = {
        id: UtilityEnum.GET_MESSAGE_MODAL_ID,
        type: UIKitSurfaceType.MODAL,
        appId: appId,
        title: {
            type: "plain_text" as const,
            text: UtilityEnum.GET_MESSAGE_MODAL_TITLE,
        },
        close: closeButton,
        // submit: sendButton,
        blocks: block,
    };
    return value;
}
