import { Global, Module } from '@nestjs/common';
import { IndicatorTypesModule } from 'src/symptomTypes/symptomTypes.module';
import { SymptomsService } from './symptoms.service';

@Global()
@Module({
  imports: [IndicatorTypesModule],
  providers: [SymptomsService],
  exports: [SymptomsService],
})

export class IndicatorsModule {}
