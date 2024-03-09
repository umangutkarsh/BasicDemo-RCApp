import {
    ButtonStyle,
    UIKitSurfaceType,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors";
import { UtilityEnum } from "../enums/UtilityEnum";
import { Block, Option, InputBlock } from "@rocket.chat/ui-kit";
import {
    getButton,
    getInputBox,
    getSectionBlock,
    getStaticSelectElement,
} from "../helpers/blockBuilder";

export async function SettingsModal(
    appId: string,
    messageId: string
): Promise<IUIKitSurfaceViewParam> {
    const block: Block[] = [];

    /* For Settings Text block */
    let settingsTextBlock = getSectionBlock(UtilityEnum.MESSAGE_LABEL);
    block.push(settingsTextBlock);

    /* For Board Input block */
    let boardInputBlock = getInputBox(
        UtilityEnum.INPUT_LABEL,
        UtilityEnum.INPUT_PLACEHOLDER,
        UtilityEnum.MESSAGE_INPUT_BLOCK_ID,
        UtilityEnum.MESSAGE_INPUT_ACTION_ID,
        appId
    );
    block.push(boardInputBlock);

    let closeButton = getButton(
        UtilityEnum.CANCEL,
        UtilityEnum.CLOSE_BLOCK_ID,
        UtilityEnum.CLOSE_ACTION_ID,
        appId,
        "",
        undefined
    );

    // Event handling for closing modal
    closeButton.actionId = UtilityEnum.CLOSE_ACTION_ID;

    let submitButton = getButton(
        UtilityEnum.SEND,
        UtilityEnum.SEND_BLOCK_ID,
        UtilityEnum.SEND_ACTION_ID,
        appId,
        messageId,
        ButtonStyle.PRIMARY
    );

    const value = {
        id: UtilityEnum.MESSAGE_MODAL_ID,
        type: UIKitSurfaceType.CONTEXTUAL_BAR,
        appId: appId,
        title: {
            type: "plain_text" as const,
            text: UtilityEnum.MESSAGE_MODAL_TITLE,
        },
        close: closeButton,
        submit: submitButton,
        blocks: block,
    };
    return value;
}
