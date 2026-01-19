import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "../common";
import { UsersController } from "./controller";
import { UserProfileController } from "./controller/user-profile.controller";
import { User } from "./model";
import { UserProfile } from "./model/user-profile.entity";
import { UserService } from "./service";
import { UserProfileService } from "./service/user-profile.service";

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User, UserProfile], "appConnection"),
  ],
  providers: [UserService, UserProfileService],
  controllers: [UsersController, UserProfileController],
  exports: [UserService, UserProfileService, TypeOrmModule],
})
export class UserModule { }
