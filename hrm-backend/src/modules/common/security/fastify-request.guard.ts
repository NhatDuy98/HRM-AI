import { UserPayload } from "../../user/model";

declare module 'fastify' {
    interface FastifyRequest {
        user: UserPayload
    }
}