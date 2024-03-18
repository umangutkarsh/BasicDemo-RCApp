import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

export class MessagePersistence {
    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead
    ) {};

    public async persist(
        room: IRoom,
        id: string,
    ): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'message'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id),
        ];

        try {
            await this.persistence.updateByAssociations(associations, {id}, true);
        } catch (err) {
            console.warn(err);
            console.log(err);
            return false;
        }
        return true;
    }

    public async findAll(): Promise<Array<string>> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'message'),
        ];

        let result: Array<string> = [];
        try {
            const records: Array<{id: string}> =
                (await this.persistenceRead.readByAssociations(associations)) as Array<{id: string}>;

            if (records.length) {
                result = records.map(({id}) => id);
            }
        } catch (err) {
            console.warn(err);
        }

        return result;
    }

    public async findByName(
        room: IRoom,
    ): Promise<Array<string>> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'message'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
        ];

        let result: Array<string> = [];
        try {
            const records: Array<{id: string}> =
                (await this.persistenceRead.readByAssociations(associations)) as Array<{id: string}>;

            if (records.length) {
                result = records.map(({id}) => id);
            }
        } catch (err) {
            console.warn(err);
        }
        return result;
    }

    public async removeByRoom(
        room: IRoom,
    ): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'message'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
        ];

        try {
            await this.persistence.removeByAssociations(associations);
        } catch (err) {
            console.warn(err);
            return false;
        }
        return true;
    }

    public async removeById(
        id: string,
    ): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'message'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, id),
        ];

        try {
            await this.persistence.removeByAssociations(associations);
        } catch (err) {
            console.warn(err);
            return false;
        }
        return true;
    }

    public async clear(): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'message'),
        ];

        try {
            await this.persistence.removeByAssociations(associations);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return true;
    }
}
