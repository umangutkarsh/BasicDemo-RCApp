import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';

// export interface basicApp implements BasicApp {
//     basicApp: BasicApp
// }

export async function getOrCreateDirectRoom(
    read: IRead,
    modify: IModify,
    usernames: Array<string>,
    creator?: IUser,
) {
    let room;
    try {
        room = await read.getRoomReader().getDirectByUsernames(usernames);
    } catch (error) {
        console.log(error);
        return;
    }
    if (room) {
        return room;
    } else {
        if(!creator) {
            creator = await read.getUserReader().getAppUser();
            if (!creator) {
                throw new Error('Error while getting the AppUser');
            }
        }

        let roomId: string;
        const newRoom = modify.getCreator()
            .startRoom()
            .setType(RoomType.DIRECT_MESSAGE)
            .setCreator(creator)
            .setMembersToBeAddedByUsernames(usernames);

        roomId = await modify.getCreator().finish(newRoom);
        return await read.getRoomReader().getById(roomId);
    }
}
