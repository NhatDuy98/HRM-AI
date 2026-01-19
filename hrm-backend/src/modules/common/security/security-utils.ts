import { FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';

import { UserPayload } from '../../user/model';
import { UnauthorizedException } from '@nestjs/common';

export function extractTokenPayload(request: FastifyRequest): UserPayload {

    const header = request.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        throw new UnauthorizedException("Invalid or missing token");
    }

    const [, tokenChunk] = header.split(' ');
    if (!tokenChunk) {
        throw new UnauthorizedException("Invalid token format");
    }

    try {

        const env = process.env;
        const payload = jwt.verify(tokenChunk, `${env.JWT_SECRET}`, {
            algorithms: ['HS256']
        });

        if (typeof payload === 'string') {
            throw new UnauthorizedException("Not allow");
        }

        return payload as UserPayload;

    }
    catch (err) {
        throw new UnauthorizedException("Not allow");
    }
}
