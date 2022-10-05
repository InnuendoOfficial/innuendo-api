import { Global, Module } from '@nestjs/common';
import { IndicatorTypesModule } from 'src/indicatorTypes/indicatorTypes.module';
import { IndicatorsService } from './indicators.service';

@Global()
@Module({
  imports: [IndicatorTypesModule],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
