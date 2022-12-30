import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { SymptomsService } from 'src/symptoms/symptoms.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportDto, reportQueriesDto } from './dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService,
              private indicatorService: SymptomsService) {}

  private defaultQueries = {
    start: null,
    end: null,
    offset: null,
    limit: null,
  }
  private REPORT_FIELDS_SELECTOR = {
    symptoms: {
      select: {
        id: true,
        symptom_type_id: true,
        value: true,
      }
    }
  }
  private async formatSymptoms(symptoms) {
    return await Promise.all(symptoms.map(async symptom => {
      const symptomType = await this.prisma.symptomType.findUnique({
        where: { id: symptom.symptom_type_id }
      });
      
      delete symptom.symptom_type_id;
      symptom['symptom_type_name'] = symptomType.name;
      symptom['symptom_type_unit_measure'] = symptomType.unit_measure;
      symptom.value = symptom.value[symptomType.unit_measure];
      return symptom;
    }));
  }
  private async formatReports(reports) {
    return await Promise.all(reports.map(async report => {
      report.symptoms = await this.formatSymptoms(report.symptoms);
      return report;
    }));
  }

  async findAllUserReports(userId: number, queries: reportQueriesDto = this.defaultQueries) {
    try {
      const { start, end, offset, limit } = queries;
      if (end && !start) {
        throw new BadRequestException("You should always use 'end' query with 'start'.")
      }
      const dateQuery = {
        AND: [
          {
            date: { lte: end ? new Date(end) : new Date(Date.now()) }
          },
          {
            date: { gte: start ? new Date(start) : new Date(null) }
          }
        ]
      }
      const reports = await this.prisma.report.findMany({
        ...(offset && { skip: offset }),
        ...(limit && { take: limit }),
        where: {
          user_id: userId,
          ...dateQuery,
        },
        include: this.REPORT_FIELDS_SELECTOR,
      });
      return await this.formatReports(reports);
    } catch (error) {
      throw error;
    }
  }

  async findUserReportById(id: number) {
    try {
      const report = await this.prisma.report.findFirst({
        where: {
          id: id,
        },
        include: this.REPORT_FIELDS_SELECTOR,
      });
      if (!report) {
        throw new NotFoundException('Record does not exist.');
      }
      report.symptoms = await this.formatSymptoms(report.symptoms);
      return report;
    } catch (error) {
      throw error;
    }
  }

  async createReport(userId: number, dto: ReportDto) {
    try {
      const report = await this.prisma.report.create({
        data: {
          user_id: userId,
          date: dto.date ? new Date(dto.date) : new Date(Date.now()),
        }
      })
      dto.symptoms.forEach(async indicator => {
        await this.indicatorService.createIndicator(indicator, report.id);
      })
      return report;
    } catch (error) {
      throw error;
    }
  }

  async updateReport(id: number, dto: ReportDto) {
    try {
      await this.prisma.report.update({
        where: { id: +id },
        data: {
          date: dto.date,
        }
      })
      dto.symptoms.forEach(async indicator => {
        await this.indicatorService.updateIndicator(indicator);
      })
      return await this.findUserReportById(id);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Record to update does not exist.');
      }
      throw error;
    }
  }

  async deleteReport(id: number) {
    try {
      await this.prisma.report.delete({
        where: { id: id }
      })
      return { msg: `Report ${id} successfully deleted.` };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Record to delete does not exist.');
      }
      throw error;
    }
  }
}
