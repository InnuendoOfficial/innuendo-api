import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiParam, ApiTags, ApiCreatedResponse, ApiUnprocessableEntityResponse, ApiAcceptedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { indicatorTypeDto } from './dto';
import { IndicatorTypesService } from './indicatorTypes.service';

@ApiTags('Indicator Types')
@Controller('indicator_types')
export class IndicatorTypesController {
  constructor(private indicatorTypesService: IndicatorTypesService) {}

  // GET
  @ApiOkResponse({description: 'The resources were returned successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })

  @Get()
  getIndicatorTypes() {
    return this.indicatorTypesService.findAllIndicatorTypes();
  }


  // GET :id
  @ApiParam({name: 'id', description: 'id of the wanted indicator type'})
  @ApiOkResponse({description: 'The resource was returned successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Get(':id')
  getIndicatorType(@Param('id') id: string) {
    return this.indicatorTypesService.findOneIndicatorType(id);
  }

  // POST
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({description: 'The body contains not wanted content'})

  @Post()
  createIndicatorType(@Body() dto: indicatorTypeDto) {
    return this.indicatorTypesService.createIndicatorType(dto);
  }


  // PUT :id
  @ApiParam({name: 'id', description: 'id of the wanted indicator type'})
  @ApiNoContentResponse({description: 'Ressource has been updated successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Put(':id')
  updateIndicatorType(@Param('id') id: string, @Body() dto: indicatorTypeDto) {
    return this.indicatorTypesService.updateIndicatorType(id, dto);
  }


  // DELETE :id
  @ApiOkResponse({description: 'Ressource has been updated successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Delete(':id')
  @ApiParam({name: 'id', description: 'id of the wanted indicator type'})
  deleteIndicatorType(@Param('id') id: string) {
    return this.indicatorTypesService.deleteIndicatorType(id);
  }
}
