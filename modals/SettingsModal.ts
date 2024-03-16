import {
    ButtonStyle,
    UIKitSurfaceType,
} from "@rocket.chat/apps-engine/definition/uikit";
import { IUIKitSurfaceViewParam } from "@rocket.chat/apps-engine/definition/accessors";
import { UtilityEnum } from "../enums/UtilityEnum";
import { Block, Option, InputBlock } from "@rocket.chat/ui-kit";
import {
    getButton,
    getChannelSelectElement,
    getInputBox,
    getMultiStaticSelectElement,
    getSectionBlock,
    getStaticSelectElement,
    getToggleSwitch,
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

    let options: Array<Option> = [
        {
            text: {
                type: "plain_text",
                text: "Message",
            },
            value: UtilityEnum.MESSAGE,
        },
        {
            text: {
                type: "plain_text",
                text: "Direct",
            },
            value: UtilityEnum.DIRECT,
        },
        {
            text: {
                type: "plain_text",
                text: "Notification",
            },
            value: UtilityEnum.NOTIFY,
        },
    ];

    let options2: Array<Option> = [
        {
            text: {
                type: "plain_text",
                text: "Message",
            },
            value: UtilityEnum.MESSAGE,
        },
        {
            text: {
                type: "plain_text",
                text: "Direct",
            },
            value: UtilityEnum.DIRECT,
        },
    ];

    let StaticSelectElement = getStaticSelectElement(
        UtilityEnum.MESSAGE_SELECT_LABEL,
        options,
        appId,
        UtilityEnum.MESSAGE_SELECT_BLOCK_ID,
        UtilityEnum.MESSAGE_SELECT_ACTION_ID,
    );

    let inputChoiceBlock: InputBlock = {
        type: "input",
        label: {
            type: "plain_text",
            text: UtilityEnum.MESSAGE_TYPE_LABEL,
        },
        element: StaticSelectElement,
    };
    block.push(inputChoiceBlock);


    let MultiStaticSelectElement = getMultiStaticSelectElement(
        UtilityEnum.MESSAGE_SELECT_LABEL,
        options,
        appId,
        UtilityEnum.MESSAGE_MULTI_SELECT_BLOCK_ID,
        UtilityEnum.MESSAGE_MULTI_SELECT_ACTION_ID,
    );

    let MultiChoiceBlock: InputBlock = {
        type: "input",
        label: {
            type: "plain_text",
            text: UtilityEnum.MESSAGE_TYPE_LABEL,
        },
        element: MultiStaticSelectElement,
    };
    block.push(MultiChoiceBlock);

    let ChannelsSelectElement = getChannelSelectElement(
        appId,
        UtilityEnum.CHANNEL_SELECT_BLOCK_ID,
        UtilityEnum.CHANNEL_SELECT_ACTION_ID,
    );

    let ChannelSelectBlock: InputBlock = {
        type: "input",
        label: {
            type: "plain_text",
            text: UtilityEnum.CHANNEL_SELECT_LABEL,
        },
        element: ChannelsSelectElement,
    }
    block.push(ChannelSelectBlock);

    // let ToggleSwitchElement = getToggleSwitch(
    //     options2,
    //     appId,
    //     UtilityEnum.CHANNEL_SELECT_BLOCK_ID,
    //     UtilityEnum.CHANNEL_SELECT_ACTION_ID,
    // );

    // let ToggleSwitchBlock: InputBlock = {
    //     type: "input",
    //     label: {
    //         type: "plain_text",
    //         text: UtilityEnum.CHANNEL_SELECT_LABEL,
    //     },
    //     element: ToggleSwitchElement,
    // };
    // block.push(ToggleSwitchBlock);

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
        id: UtilityEnum.SETTINGS_MODAL_ID,
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
