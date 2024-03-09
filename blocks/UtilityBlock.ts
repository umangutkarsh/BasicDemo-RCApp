import { Block, SectionBlock } from '@rocket.chat/ui-kit';
import { UtilityEnum } from '../enums/UtilityEnum';
import { getActionsBlock, getButton, getMarkdownBlock } from '../helpers/blockBuilder';
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

    const deleteMessageButton = getButton(
        "Delete",
        UtilityEnum.PREVIEW_BLOCK_ID,
        UtilityEnum.DELETE_MESSAGE_ID,
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
        deleteMessageButton,
        settingsButton,
    ]);
    block.push(markdownBlock);
    block.push(actionBlock);
    return block;
}

export async function messageHeaderBlock(
    // username: string,
    // appId: string,
): Promise<Array<Block>> {
    const block: Block[] = [];

    let markdownBlock: SectionBlock = getMarkdownBlock('This is a custom message');
    block.push(markdownBlock);
    return block;

}
