import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProDto, ProDto } from './dto';
import * as argon from 'argon2';
import { SubscriptionRequestDto } from 'src/subscription_request/dto';
import { AccessCode } from '@prisma/client';
import { ReportsService } from 'src/reports/reports.service';
import { ProAuthDto } from './dto/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class ProService {
  constructor(
    private prisma: PrismaService,
    private reportService: ReportsService,
    private authService: AuthService,
    private  mailService: MailService,
  ) {}

  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  private getDueDate(createAt: Date) {
    const dueDate = new Date(createAt);
  
    dueDate.setDate(dueDate.getDate() + 2);
    return dueDate;
  }

  private async codeIsExpired(code: AccessCode) {
    const dueDate = this.getDueDate(code.created_at);

    if (Number(dueDate) < Date.now()) {
      await this.prisma.accessCode.deleteMany({
        where: { id: code.id }
      });
      return true;
    }
    return false;
  }
  private async selectOnlyShowableSymptoms(reports, preferences) {
    return reports.map(report => {
      report.symptoms = report.symptoms.filter(symtom => {
        const pref = preferences.find(pref => pref.symptom_id == symtom.symptom_type_id);

        if (!pref || pref.showable) {
          return true;
        } else {
          return false;
        }
      })
      return report;
    })
  }

  async createProFromSubsrciptionRequest(dto) {
    try {
      const subscription_request: SubscriptionRequestDto = await this.prisma.subscriptionRequest.findFirst({
        where: {
          id: dto.subscription_request_id,
        }
      });
      if (!subscription_request) {
        throw new NotFoundException('Subscription request does not exist.');
      }
      const password: string = this.generatePassword();
      const hash = await argon.hash(password);

      const pro = await this.prisma.pro.create({
        data: {
          first_name: subscription_request.first_name,
          last_name: subscription_request.last_name,
          email: subscription_request.email,
          phone: subscription_request.phone,
          subscription_type: subscription_request.subscription_type,
          hash,
        }
      });
      delete pro.hash;
      pro['password'] = password;
      return pro;
    } catch (error) {
      throw error;
    }
  }

  async createPro(dto: CreateProDto) {
    try {
      const password: string = this.generatePassword();
      const hash = await argon.hash(password);

      const pro = await this.prisma.pro.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          email: dto.email,
          phone: dto.phone,
          subscription_type: dto.subscription_type,
          hash,
        }
      });
      delete pro.hash;
      pro['password'] = password;
      return pro;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already used');
        }
      }
      throw error;
    }
  }

  async getPatientDatasFromCode(codeValue: number) {
    try {
      const code = await this.prisma.accessCode.findFirst({
        where: { value: codeValue },
        include: {
          preferences: true
        }
      })
    
      if (!code || await this.codeIsExpired(code)) {
        throw new NotFoundException('The code has expired or doesn\'t exist.');
      }
      const reports = await this.reportService.findAllUserReports(code.user_id);
      return {
        code_expiracy: this.getDueDate(code.created_at),
        data: await this.selectOnlyShowableSymptoms(reports, code.preferences)
      }
    } catch (error) {
      throw error;
    }
  }

  async getPatientProfileFromCode(codeValue: number) {
    try {
      const code = await this.prisma.accessCode.findFirst({
        where: { value: codeValue },
        include: {
          preferences: true
        }
      })
    
      if (!code || await this.codeIsExpired(code)) {
        throw new NotFoundException('The code has expired or doesn\'t exist.');
      }
      const user = await this.prisma.user.findUnique({
        where: { id: code.user_id }
      })

      delete user.hash;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getPatients() {
    try {
      let users = await this.prisma.user.findMany();

      return this.prisma.listExclude(users, ['hash']);
    } catch (error) {
      throw error;
    }
  }

  async findProById(id: number) {
    try {
      const pro = await this.prisma.pro.findUnique({
        where: { id: id }
      })
      if (!pro) {
        throw new NotFoundException('Pro not found');
      }
      delete pro.hash;
      return pro;
    } catch (error) {
      throw error;
    }
  }

  async updateProById(id: number, dto: ProDto) {
    try {
      const pro = await this.prisma.pro.update( {
        where: { id:  id },
        data: {
          ...dto
        }
      })
      delete pro.hash;
      return pro;
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

  async login(dto: ProAuthDto) {
    const pro = await this.prisma.pro.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!pro) throw new ForbiddenException('Incorrect email');
    if (!(await argon.verify(pro.hash, dto.password)))
      throw new ForbiddenException('Incorrect password');
    delete pro.hash;
    return this.authService.getAccessToken(pro.id);
  }

  async changeEmail(id: number, newEmail: string) {
    try {
      const pro = await this.prisma.pro.update({
        where: {id: id},
        data: {
          email: newEmail,
        }
      })
      delete pro.hash;
      return pro;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(email: string) {
    const user = await this.prisma.pro.findUnique({
      where: { email: email },
    })

    if (user) {
      const newPassword = this.generatePassword();

      await this.prisma.pro.update({
        where: { id: user.id },
        data: { hash: await argon.hash(newPassword) }
      })
      await this.mailService.sendForgottenPasswordEmail(user, newPassword);
      return 'password changed.';
    }
    throw new NotFoundException('No user is linked to this email.');
  }
}
