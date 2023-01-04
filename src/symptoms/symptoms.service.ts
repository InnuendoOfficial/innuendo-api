import { BadRequestException, Injectable } from '@nestjs/common';
import { IndicatorTypesService } from 'src/symptomTypes/symptomTypes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SymptomDto } from './dto';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';

@Injectable()
export class SymptomsService {
  constructor(private prisma: PrismaService,
              private symptomTypesService: IndicatorTypesService) {}

  async createSymptom(dto: SymptomDto, reportId: number) {
    try {
      const symptomValue = await this.buildSymptomValue(dto.symptom_type_id, dto.value);
      await this.prisma.symptom.create({
        data: {
          symptom_type: {
            connect: { id: dto.symptom_type_id }
          },
          report: {
            connect: { id: reportId }
          },
          value: {
            create: symptomValue
          }
        },
        include: {
          value: true,
        }
      })
    } catch (error) {
      throw error;
    }
  }

  async updateSymptom(dto: SymptomDto) {
    try {
      const symptomValue = await this.buildSymptomValue(dto.symptom_type_id, dto.value);

      await this.prisma.symptom.update({
        where: { id:  dto.id },
        data: {
          value: {
            update: symptomValue
          }
        }
      })
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        console.log(error);
        throw new BadRequestException(`Symptom's field 'value' must have the type declared in the corresponding SymptomType`)
      } else {
        throw error;
      }
    }
  }

  async buildSymptomValue(symptomId: number, symptomValue: any) {
    try {
      const symptomType = await this.symptomTypesService.findOneIndicatorType(symptomId);
      return {
        [symptomType.unit_measure]: symptomValue,
      };
    } catch (error) {
      throw error;
    }
  }
}
