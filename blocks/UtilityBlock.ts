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
        `${messageURL}`,
        ButtonStyle.PRIMARY
    );

    const deleteMessageButton = getButton(
        "Delete",
        UtilityEnum.PREVIEW_BLOCK_ID,
        UtilityEnum.DELETE_MESSAGE_ID,
        appId,
        `${messageURL}`,
        ButtonStyle.DANGER,
    );

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
    ]);
    block.push(markdownBlock);
    block.push(actionBlock);
    return block;
}
