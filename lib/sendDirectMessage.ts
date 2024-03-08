import { IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { getOrCreateDirectRoom } from './getOrCreateDirectRoom';
import { BasicDemoApp } from '../BasicDemoApp';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { sendMessage } from './sendMessage';

// export async function sendDirectMessage(
//     read: IRead,
//     modify: IModify,
//     user: IUser,
//     message: string,
//     persis: IPersistence,
// ): Promise<string> {
//     const appUser = (await read.getUserReader().getAppUser()) as IUser;
//     const targetRoom = (await getDirect(read, modify, appUser, appUser.username)) as IRoom;
//     if(!appUser) {
//         throw new Error(`Something went wrong getting the user info`);
//     }

//     const shouldSend = await shouldSendMessage(read, user, persis);
//     if (!shouldSend) {
//         return "";
//     }

//     return await sendMessage(modify, targetRoom, user, message);
// }

export async function sendDirectMessage(
    context: SlashCommandContext,
    read: IRead,
    modify: IModify,
    message: string,
): Promise<void> {
    const messageStructure = modify.getCreator().startMessage();
    const sender = context.getSender();
    const appUser = await read.getUserReader().getAppUser();
    if (!appUser) {
        throw new Error(`Error getting the app user`);
    }
    let room = (await getOrCreateDirectRoom(read, modify, [
        sender.username,
        appUser.username,
    ])) as IRoom;

    messageStructure.setRoom(room).setText(message);
    await modify.getCreator().finish(messageStructure);
}
