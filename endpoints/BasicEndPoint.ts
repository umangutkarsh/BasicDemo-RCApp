import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ApiEndpoint, IApiEndpointInfo, IApiRequest, IApiResponse } from '@rocket.chat/apps-engine/definition/api';

export class BasicEndpoint extends ApiEndpoint {
    public path = "basic";

    public async post(
        request: IApiRequest,
        enpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        perisistence: IPersistence,
    ): Promise<IApiResponse> {
        var body: string;
        if (Object.entries(request.content).length) {
            body = Object.entries(request.content)
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join(`\n`);
        } else {
            body = `No Payload sent! :cry:`;
        }

        this.app.getLogger().info(`Endpoint called: ` + body);
        console.log(`Endpoint called: ` + body);

        const room = await read.getRoomReader().getById("GENERAL");
        if (!room) {
            return {
                status: HttpStatusCode.NOT_FOUND,
                content: `Room with id #GENERAL not found`,
            };
        }

        const message = modify.getCreator().startMessage().setText(body).setRoom(room);
        this.app.getLogger().info(message);
        const messageId = await modify.getCreator().finish(message);

        return this.success({
            success: true,
            messageId: messageId,
        });
    }
}
