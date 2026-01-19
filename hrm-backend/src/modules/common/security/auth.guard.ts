import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { extractTokenPayload } from "./security-utils";
// import { UserService } from "../../user/service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        // private readonly userService: UserService,
    ){}

    public async canActivate(cxt: ExecutionContext): Promise<boolean> {
        const request = cxt.switchToHttp().getRequest<FastifyRequest>();
        const payload = extractTokenPayload(request);
        // const user = await this.userService.findByIdService(payload.id);
        
        // if (!user) {
        //     throw new UnauthorizedException('User not found');
        // }

        // if (!user.isLogin) {
        //     throw new UnauthorizedException('Not allow');
        // }
        
        request.user =  payload

        return true
    }
}