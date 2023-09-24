import { Module } from '@nestjs/common';
import { IndicatorTypesController } from './symptomTypes.controller';
import { IndicatorTypesService } from './symptomTypes.service';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  controllers: [IndicatorTypesController],
  providers: [IndicatorTypesService],
  exports: [IndicatorTypesService],
  imports: [AwsModule]
})
export class IndicatorTypesModule {}
