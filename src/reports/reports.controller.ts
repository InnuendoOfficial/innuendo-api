import { Body, Controller, Get, Post, Param, Delete, Query, Put, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ReportDto, reportQueriesDto } from './dto';
import { ReportsService } from './reports.service';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from 'src/sentry.interceptor';
@ApiTags('Reports')

@UseInterceptors(SentryInterceptor)
@UseGuards(JwtGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // GET
  @ApiOkResponse({description: 'The resources were returned successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiQuery({name: 'start', description: 'exclude all reports whose date is older than', example: '02/04/2022'})
  @ApiQuery({name: 'end', description: 'exclude all reports whose date is newer than', example: '08/09/2022'})
  @ApiQuery({name: 'offset', description: 'pagination index', example: 2})
  @ApiQuery({name: 'limit', description: 'pagination quantity', example: 5})

  @Get()
  getReports(@Query() queries: reportQueriesDto, @GetUser() user : User) {
    return this.reportsService.findAllUserReports(user.id, queries);
  }


  // GET :id
  // TODO: add auth guard to check if user has permission to access to the report
  @ApiParam({name: 'id', description: 'id of the wanted report'})
  @ApiOkResponse({description: 'The resource was returned successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Get(':id')
  getReport(@Param('id') id: string) {
    return this.reportsService.findUserReportById(+id);
  }

  // POST
  @ApiCreatedResponse({description: 'The ressource has been created'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({description: 'The body contains not wanted content'})

  @Post()
  createReport(@Body() dto: ReportDto,  @GetUser() user : User) {
    return this.reportsService.createReport(user.id, dto);
  }


  // PUT :id
  // TODO: add auth guard to check if user has permission to access to the report
  @ApiParam({name: 'id', description: 'id of the wanted symtom type'})
  @ApiNoContentResponse({description: 'Ressource has been updated successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Put(':id')
  updateReport(@Param('id') id: string, @Body() dto: ReportDto) {
    return this.reportsService.updateReport(+id, dto);
  }


  // DELETE :id
  // TODO: add auth guard to check if user has permission to access to the report
  @ApiOkResponse({description: 'Ressource has been updated successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({description: 'The ressource does not exist'})

  @Delete(':id')
  deleteReport(@Param('id') id: string) {
    return this.reportsService.deleteReport(+id);
  }
}
