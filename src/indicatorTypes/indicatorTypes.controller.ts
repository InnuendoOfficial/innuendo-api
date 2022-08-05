import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { indicatorTypesDto } from './dto';
import { IndicatorTypesService } from './indicatorTypes.service';

@Controller('indicator_types')
export class IndicatorTypesController {
  constructor(private indicatorTypesService: IndicatorTypesService) {}

  @Get()
  getIndicators() {
    return this.indicatorTypesService.findAllIndicatorTypes();
  }

  @Get(':id')
  getIndicator(@Param('id') id: string) {
    return this.indicatorTypesService.findOneIndicatorType(id);
  }

  @Post()
  createIndicator(@Body() dto: indicatorTypesDto) {
    return this.indicatorTypesService.createIndicatorType(dto);
  }

  @Delete(':id')
  deleteIndicator(@Param('id') id: string) {
    return this.indicatorTypesService.deleteIndicatorType(id);
  }
}
