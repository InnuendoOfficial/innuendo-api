import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { authController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { JwtRefreshStrategy } from './strategy/jwt.refresh.strategy';

@Module({
    imports: [JwtModule.register({}),],
    controllers: [authController],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
    exports: [AuthService]
})
export class AuthModule {}