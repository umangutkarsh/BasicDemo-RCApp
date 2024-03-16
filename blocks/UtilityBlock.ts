import { Block, SectionBlock } from '@rocket.chat/ui-kit';
import { UtilityEnum } from '../enums/UtilityEnum';
import { getActionsBlock, getButton, getMarkdownBlock, getSecButton } from '../helpers/blockBuilder';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';

export async function buildHeaderBlock(
    username: string,
    messageURL: string,
    appId: string,
    messageName?: string
): Promise<Array<Block>> {
    const block: Block[] = [];
    const messagebutton = getButton(
        "Message",
        UtilityEnum.PREVIEW_BLOCK_ID,
        UtilityEnum.MESSAGE_BUTTON_ACTION_ID,
        appId,
        "Message",
        ButtonStyle.PRIMARY
    );

    const notifyButton = getSecButton(
        "Notify",
        UtilityEnum.PREVIEW_BLOCK_ID,
        UtilityEnum.NOTIFY_BUTTON_ACTION_ID,
        appId,
        "Notify",
        ButtonStyle.PRIMARY,
    );

    const directButton = getSecButton(
        "Direct",
        UtilityEnum.PREVIEW_BLOCK_ID,
        UtilityEnum.DIRECT_BUTTON_ACTION_ID,
        appId,
        "Direct",
        ButtonStyle.PRIMARY,
    );

    const deleteMessageButton = getButton(
        "Delete",
        UtilityEnum.PREVIEW_BLOCK_ID,
        UtilityEnum.DELETE_MESSAGE_ACTION_ID,
        appId,
        "Delete",
        ButtonStyle.DANGER,
    );

    const settingsButton = getButton(
        "Settings",
        UtilityEnum.PREVIEW_BLOCK_ID,
        UtilityEnum.SETTINGS_BUTTON_ACTION_ID,
        appId,
        "Settings",
        ButtonStyle.PRIMARY,
    )

    let markdownBlock: SectionBlock;
    // if (messageName == undefined) {
    //     markdownBlock = getMarkdownBlock(
    //         `*Untitled Whiteboard* by \`@${username}\``
    //     );
    // } else {
        markdownBlock = getMarkdownBlock(`By *\`@${username}\`*`);
    // }

    const actionBlock = getActionsBlock(UtilityEnum.PREVIEW_BLOCK_ID, [
        messagebutton,
        notifyButton,
        directButton,
        deleteMessageButton,
        settingsButton,
    ]);
    block.push(markdownBlock);
    block.push(actionBlock);
    return block;
}

export async function messageHeaderBlock(
    message: string,
): Promise<Array<Block>> {
    const block: Block[] = [];

    let markdownBlock: SectionBlock = getMarkdownBlock(message);
    block.push(markdownBlock);
    return block;

}
