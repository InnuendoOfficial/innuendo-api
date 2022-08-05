import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { indicatorTypeDto } from './dto';
import { IndicatorTypesService } from './indicatorTypes.service';

@Controller('indicator_types')
export class IndicatorTypesController {
  constructor(private indicatorTypesService: IndicatorTypesService) {}

  @Get()
  getIndicatorTypes() {
    return this.indicatorTypesService.findAllIndicatorTypes();
  }

  @Get(':id')
  getIndicatorType(@Param('id') id: string) {
    return this.indicatorTypesService.findOneIndicatorType(id);
  }

  @Post()
  createIndicatorType(@Body() dto: indicatorTypeDto) {
    return this.indicatorTypesService.createIndicatorType(dto);
  }

  @Put(':id')
  updateIndicatorType(@Param('id') id: string, @Body() dto: indicatorTypeDto) {
    return this.indicatorTypesService.updateIndicatorType(id, dto);
  }

  @Delete(':id')
  deleteIndicatorType(@Param('id') id: string) {
    return this.indicatorTypesService.deleteIndicatorType(id);
  }
}
