import { Module } from '@nestjs/common';
import { IndicatorTypesController } from './symptomTypes.controller';
import { IndicatorTypesService } from './symptomTypes.service';

@Module({
  controllers: [IndicatorTypesController],
  providers: [IndicatorTypesService],
  exports: [IndicatorTypesService],
})
export class IndicatorTypesModule {}
