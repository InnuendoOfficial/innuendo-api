import { Module } from '@nestjs/common';
import { ReportsModule } from 'src/reports/reports.module';
import { EndoscoresController } from './endoscores.controller';
import { EndoscoresService } from './endoscores.service';

@Module({
  imports: [ReportsModule],
  controllers: [EndoscoresController],
  providers: [EndoscoresService]
})
export class EndoscoresModule {}
