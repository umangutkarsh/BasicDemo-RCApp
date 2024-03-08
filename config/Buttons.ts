import { IUIActionButtonDescriptor, RoomTypeFilter } from '@rocket.chat/apps-engine/definition/ui';
import { UIActionButtonContext } from '../enums/UIActionButtonContext';

export const buttons: Array<IUIActionButtonDescriptor> = [
    {
        actionId: 'my-action-id-message',
        labelI18n: 'Message Action',
        context: UIActionButtonContext.MESSAGE_ACTION,
        when: {
            roomTypes: [
                RoomTypeFilter.DIRECT,
                RoomTypeFilter.PRIVATE_CHANNEL,
                RoomTypeFilter.PUBLIC_CHANNEL,
            ]
        }
    },
    {
        actionId: 'my-action-id-room',
        labelI18n: 'Room Action',
        context: UIActionButtonContext.ROOM_ACTION,
    }
]
