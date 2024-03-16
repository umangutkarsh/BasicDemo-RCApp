import { IUIKitSurfaceViewParam } from '@rocket.chat/apps-engine/definition/accessors';
import { Block } from '@rocket.chat/ui-kit';
import { getButton, getInputBox, getSectionBlock } from '../helpers/blockBuilder';
import { UtilityEnum } from '../enums/UtilityEnum';
import { ButtonStyle, UIKitSurfaceType } from '@rocket.chat/apps-engine/definition/uikit';
import { BasicDemoApp } from '../BasicDemoApp';

export async function NotifyModal(
    app: BasicDemoApp,
    appId: string,
    messageId: string,
): Promise<IUIKitSurfaceViewParam> {
    const block: Block[] = [];

    let messageTextBlock = getSectionBlock(UtilityEnum.NOTIFY_LABEL);
    block.push(messageTextBlock);

    let inputBlock = getInputBox(
        UtilityEnum.NOTIFY_INPUT_LABEL,
        UtilityEnum.NOTIFY_INPUT_PLACEHOLDER,
        UtilityEnum.NOTIFY_INPUT_BLOCK_ID,
        UtilityEnum.NOTIFY_INPUT_ACTION_ID,
        appId,
    );
    block.push(inputBlock);

    let closeButton = getButton(
        UtilityEnum.CANCEL,
        UtilityEnum.CLOSE_BLOCK_ID,
        UtilityEnum.CLOSE_ACTION_ID,
        appId,
        "",
        undefined,
    );

    let sendButton = getButton(
        UtilityEnum.SEND,
        UtilityEnum.SEND_BLOCK_ID,
        UtilityEnum.SEND_ACTION_ID,
        appId,
        messageId,
        ButtonStyle.PRIMARY,
    );

    const value = {
        id: UtilityEnum.NOTIFY_MODAL_ID,
        type: UIKitSurfaceType.MODAL,
        appId: appId,
        title: {
            type: "plain_text" as const,
            text: UtilityEnum.NOTIFY_MODAL_TITLE,
        },
        close: closeButton,
        submit: sendButton,
        blocks: block,
    };
    return value;
}
