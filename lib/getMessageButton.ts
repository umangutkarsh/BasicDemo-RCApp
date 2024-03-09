import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { buildHeaderBlock } from '../blocks/UtilityBlock';
import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { BasicDemoApp } from '../BasicDemoApp';
import { randomId } from './utils';
import { sendMessage } from './sendMessage';

export async function getMessageButton(
    app: BasicDemoApp,
    context: SlashCommandContext,
    read: IRead,
    modify: IModify,
    http: IHttp,
    persistence: IPersistence,
) {
    const endpoints = app.getAccessors().providedApiEndpoints;
    const messageEndpoint = endpoints[0];
    const appId = app.getID();

    const randMessageId = randomId();
    const messageURL = `${messageEndpoint.computedPath}?id=${randMessageId}`
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const sender = context.getSender();
    const room = context.getRoom();
    const params = context.getArguments();
    const headerBlock = await buildHeaderBlock(
        sender.username,
        messageURL,
        appId,
    );
    const messageId = await sendMessage(
            modify,
            room,
            appUser,
            `Message Button created by @${sender.username}`,
            headerBlock,
        );

    console.log('MesssageId: ', messageId);

}
