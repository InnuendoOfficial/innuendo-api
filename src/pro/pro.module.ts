import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ReportsModule } from 'src/reports/reports.module';
import { ProController } from './pro.controller';
import { ProService } from './pro.service';

@Module({
  imports: [ReportsModule, AuthModule],
  controllers: [ProController],
  providers: [ProService],
})
export class ProModule {}
