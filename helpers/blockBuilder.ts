import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { ActionsBlock, ButtonElement, ContextBlock, DividerBlock, InputBlock, LayoutBlockType, MultiStaticSelectElement, Option, PreviewBlockWithPreview, SectionBlock, StaticSelectElement, ChannelsSelectElement, ToggleSwitchElement } from '@rocket.chat/ui-kit';

export function getInputBox(
    labelText: string,
    placeholderText: string,
    blockId: string,
    actionId: string,
    appId: string,
    intitialValue?: string,
    multiline?: boolean,
) {
    const block: InputBlock = {
        type: "input",
        label: {
            type: "plain_text",
            text: labelText,
            emoji: true,
        },
        element: {
            type: "plain_text_input",
            placeholder: {
                type: "plain_text",
                text: placeholderText,
                emoji: true,
            },
            appId,
            blockId,
            actionId,
            initialValue: intitialValue,
            multiline: multiline
        },
    };
    return block;
}

export function getButton(
    labelText: string,
    blockId: string,
    actionId: string,
    appId: string,
    value?: string,
    style?: ButtonStyle.PRIMARY | ButtonStyle.DANGER,
    url?: string,
) {
    const button: ButtonElement = {
        type: "button",
        text: {
            type: "plain_text",
            text: labelText,
            emoji: true,
        },
        appId,
        blockId,
        actionId,
        url,
        value,
        style,
        secondary: false,
    };
    return button;
}

export function getSecButton(
    labelText: string,
    blockId: string,
    actionId: string,
    appId: string,
    value?: string,
    style?: ButtonStyle.PRIMARY | ButtonStyle.DANGER,
    url?: string,
) {
    const button: ButtonElement = {
        type: "button",
        text: {
            type: "plain_text",
            text: labelText,
            emoji: true,
        },
        appId,
        blockId,
        actionId,
        url,
        value,
        style,
        secondary: true,
    };
    return button;
}


export function getEditBlock(
    blockId: string,
    elements: Array<ButtonElement> | Array<StaticSelectElement>
) {
    const block: ActionsBlock = {
        type: "actions",
        blockId,
        elements,
    };
    return block;
}

export function getSectionBlock(
    labelText: string,
    accessory?: any,
) {
    const block: SectionBlock = {
        type: "section",
        text: {
            type: "plain_text",
            text: labelText,
            emoji: true,
        },
        accessory: accessory,
    };
    return block;
}

export function getMarkdownBlock(
    labelText: string,
) {
    const block: SectionBlock = {
        type: "section",
        text: {
            type: "mrkdwn",
            text: labelText,
        },
    };
    return block;
}

export function getDividerBlock() {
    const block: DividerBlock = {
        type: "divider",
    };
    return block;
}

export function getContextBlock(elementText: string) {
    const block: ContextBlock = {
        type: "context",
        elements: [
            {
                type: "plain_text",
                text: elementText,
            }
        ]
    };
    return block;
}

export function getStaticSelectElement(
    placeholder: string,
    options: Array<Option>,
    appId: string,
    blockId: string,
    actionId: string,
    initialValue?: Option['value'],
) {
    const block: StaticSelectElement = {
        type: "static_select",
        placeholder: {
            type: "plain_text",
            text: placeholder,
            emoji: true,
        },
        options: options,
        appId,
        blockId,
        actionId,
        initialValue,
    };
    return block;
}

export function getMultiStaticSelectElement(
    placeholderText: string,
    options: Array<Option>,
    appId: string,
    blockId: string,
    actionId: string,
    initialValue?: Option["value"][],
) {
    const block: MultiStaticSelectElement = {
        type: "multi_static_select",
        placeholder: {
            type: "plain_text",
            text: placeholderText,
        },
        options,
        appId,
        blockId,
        actionId,
        initialValue,
    };
    return block;
}

export function getOptions(
    text: string,
    value: string,
) {
    const option: Option = {
        text: {
            type: "plain_text",
            text: text
        },
        value,
    };
    return option;
}

export function getActionsBlock(
    blockId: string,
    elements: Array<ButtonElement> | Array<StaticSelectElement>,
) {
    const block: ActionsBlock = {
        type: "actions",
        blockId,
        elements,
    };
    return block;
}

// export function getPreviewBlock(
//     url: string,
//     title: string,
//     boardURL: string,
//     dimensions: {
//         width: number,
//         height: number,
//     }
// ) {
//     const block: PreviewBlockWithPreview = {
//         preview: {
//             url: url,
//             dimensions: {
//                 width: dimensions?.width || 500,
//                 height: dimensions?.height || 500,
//             }
//         },
//         type: LayoutBlockType.PREVIEW,
//         title: [
//             {
//                 type: "plain_text",
//                 text: title,
//             },
//         ],
//         description: [],
//         externalUrl: boardURL,
//         oembedUrl: boardURL,
//         thumb: undefined,
//     };
//     return block;
// }

export function getChannelSelectElement(
    appId: string,
    blockId: string,
    actionId: string,
) {
    const block: ChannelsSelectElement = {
        type: "channels_select",
        appId,
        blockId,
        actionId,
    };
    return block;
}

export function getToggleSwitch(
    options: Array<Option>,
    appId: string,
    blockId: string,
    actionId: string,
) {
    const block: ToggleSwitchElement = {
        type: "toggle_switch",
        options,
        appId,
        blockId,
        actionId,
    };
    return block;
}
