import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProDto } from './dto';
import * as argon from 'argon2';
import { SubscriptionRequestDto } from 'src/subscription_request/dto';
import { AccessCode } from '@prisma/client';
import { ReportsService } from 'src/reports/reports.service';
import { ProAuthDto } from './dto/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ProService {
  constructor(
    private prisma: PrismaService,
    private reportService: ReportsService,
    private authService: AuthService,
    private  mailService: MailService,
  ) {}

  private generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  private async codeIsExpired(code: AccessCode) {
    const dueDate = new Date(code.created_at);
  
    dueDate.setDate(dueDate.getDate() + 2);
    if (Number(dueDate) < Date.now()) {
      await this.prisma.accessCode.deleteMany({
        where: { id: code.id }
      });
      return true;
    }
    return false;
  }
  private async selectOnlyShowableSymptoms(reports, preferences) {
    console.log(preferences)
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

  async createProFromSubsrciptionRequest(dto: CreateProDto) {
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
      return this.selectOnlyShowableSymptoms(reports, code.preferences);
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
    return this.authService.getAccessToken(pro.email);
  }

  async changePassword(email: string) {
    const user = await this.prisma.pro.findUnique({
      where: { email: email },
    })

    if (user) {
      const newPassword = 'TOTO974'// generate new password and store it in database
      await this.mailService.sendForgottenPasswordEmail(user, newPassword);
    }
  }
}
