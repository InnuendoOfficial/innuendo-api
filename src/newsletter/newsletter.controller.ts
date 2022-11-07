import { Body, Controller, Get, Post, Redirect, Delete, Param } from '@nestjs/common';
import { NewsletterDto } from './dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}

  // GET
  @Get()
  getProspects() {
    return this.newsletterService.findAllProspect();
  }


  // POST
  @Post()
  @Redirect('https://innuendo-3672aa.webflow.io/')
  addProspect(@Body() dto: NewsletterDto) {
    return this.newsletterService.createProspect(dto);
  }


  // DELETE :id
  @Delete(':id')
  deleteProspect(@Param('id') id: string) {
    return this.newsletterService.DeleteProspect(+id);
  }
}
