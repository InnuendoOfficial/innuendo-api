import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiParam, ApiTags, ApiCreatedResponse, ApiUnprocessableEntityResponse, ApiAcceptedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { symptomTypeDto } from './dto';
import { IndicatorTypesService } from './symptomTypes.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Symptoms Types')
@Controller('symptom_types')
export class IndicatorTypesController {
  constructor(private symptomTypesService: IndicatorTypesService) {}

  // GET
  @ApiOkResponse({description: 'The resources were returned successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })

  @Get()
  getIndicatorTypes() {
    return this.symptomTypesService.findAllIndicatorTypes();
  }


  // GET :id
  @ApiParam({name: 'id', description: 'id of the wanted symptom type'})
  @ApiOkResponse({description: 'The resource was returned successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Get(':id')
  getIndicatorType(@Param('id') id: string) {
    return this.symptomTypesService.findOneIndicatorType(+id);
  }

  // POST
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({description: 'The body contains not wanted content'})

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  createIndicatorType(@Body() dto: symptomTypeDto,  @UploadedFile() icon) {
    return this.symptomTypesService.createIndicatorType(dto, icon);
  }


  // PUT :id
  @ApiParam({name: 'id', description: 'id of the wanted symptom type'})
  @ApiNoContentResponse({description: 'Ressource has been updated successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Put(':id')
  @UseInterceptors(FileInterceptor('icon'))
  updateIndicatorType(@Param('id') id: string, @Body() dto: symptomTypeDto, @UploadedFile() icon) {
    return this.symptomTypesService.updateIndicatorType(+id, dto, icon);
  }


  // DELETE :id
  @ApiOkResponse({description: 'Ressource has been updated successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Delete(':id')
  @ApiParam({name: 'id', description: 'id of the wanted symptom type'})
  deleteIndicatorType(@Param('id') id: string) {
    return this.symptomTypesService.deleteIndicatorType(id);
  }
}
