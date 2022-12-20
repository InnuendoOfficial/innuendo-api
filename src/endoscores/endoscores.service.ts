import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { end } from 'pactum/src/exports/reporter';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class EndoscoresService {
  constructor(private prismaService: PrismaService, private reportservice: ReportsService) {}

  async findAllEndscores(user: User) {
    try {
      const endoscores = await this.prismaService.endoscore.findMany({
        where: {
          user_id: user.id
        }
      });

      return endoscores;
    } catch (error) {
      throw error;
    }
  }

  async findLastEndoscore(user: User) {
    try {
      const endoscore = await this.prismaService.endoscore.findFirst({
        where: {
          user_id: user.id,
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      if (!endoscore) {
        throw new NotFoundException('This user has no endoscore.');
      }
      return endoscore;
    } catch (error) {
      
    }
  }

  async createEndoscore(user: User) {
    try {
      const reports = await this.reportservice.findAllUserReports(user.id);
      
      // requete sur l'ia pour chopper l'endoscore
      const endoscore = Math.floor(Math.random() * 10);
      
      return await this.prismaService.endoscore.create({
        data: {
          score: endoscore,
          user_id: user.id,
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
