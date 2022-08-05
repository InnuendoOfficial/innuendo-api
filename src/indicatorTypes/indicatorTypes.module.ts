import { Module } from '@nestjs/common';
import { IndicatorTypesController } from './indicatorTypes.controller';
import { IndicatorTypesService } from './indicatorTypes.service';

@Module({
  controllers: [IndicatorTypesController],
  providers: [IndicatorTypesService],
})
export class IndicatorTypesModule {}
