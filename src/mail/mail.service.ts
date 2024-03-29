import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pro, User } from '@prisma/client';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';
import { SendgridService } from 'src/sendgrid/sendgrid.service'; // add this

@Injectable()
export class MailService {
  constructor(private readonly sendgridService: SendgridService) {}

  private compileHandlebar(templateName, context) {
    try {
      const file = readFileSync(join(__dirname, `/templates/${templateName}.hbs`), 'utf-8');
      const template = Handlebars.compile(file);
      
      return template(context);
    } catch (error) {
      throw new NotFoundException('Email type not existing.');
    }
  }

  async sendForgottenPasswordEmail(user: Pro, newPassword: string) {
    const mail = {
      to: user.email,
      subject: 'Votre nouveau mot de passe Innuendo',
      from: 'noreply@em3594.innuendo.ovh',
      html: this.compileHandlebar(
        'forgotten_password',
        {
          name: user.first_name,
          password: newPassword
        }
      ),
    };

    try {
      await this.sendgridService.send(mail);
    } catch (error) {
      throw new InternalServerErrorException("Mailing service not working")
    }
    return "email sent";
  }

  async sendCredentialsEmail(user: Pro, password: string) {
    const mail = {
      to: user.email,
      subject: 'Votre identifiants Innuendo',
      from: 'noreply@em3594.innuendo.ovh',
      html: this.compileHandlebar(
        'credentials',
        {
          name: user.first_name,
          password,
          email: user.email
        }
      ),
    };

    try {
      await this.sendgridService.send(mail);
    } catch (error) {
      throw new InternalServerErrorException("Mailing service not working")
    }
    return "email sent";
  }
  
  async sendPaymentLink(user: Pro, paymentLink: string) {
    const mail = {
      to: user.email,
      subject: 'Finaliser votre abonnement à Innuendo',
      from: 'noreply@em3594.innuendo.ovh',
      html: this.compileHandlebar(
        'payment_link',
        {
          name: user.first_name,
          payment_link: paymentLink
        }
      ),
    };

    try {
      await this.sendgridService.send(mail);
    } catch (error) {
      throw new InternalServerErrorException("Mailing service not working")
    }
    return "email sent";
  }

  async sendNewsletterSubscription(name: string, email: string, object: string) {
    const mail = {
      to: 'innuendo.contact@gmail.com',
      subject: 'Nouvelle abonnée à la newsletter',
      from: 'noreply@em3594.innuendo.ovh',
      html: this.compileHandlebar(
        'newsletter_subscription',
        {
          name,
          email,
          object
        }
      ),
    };

    try {
      await this.sendgridService.send(mail);
    } catch (error) {
      throw new InternalServerErrorException("Mailing service not working")
    }
    return "email sent";
  }

  async sendForgottenPasswordLink(name: string, email: string, link: string) {
    const mail = {
      to: email,
      subject: 'Réinitialiser votre mot de passe',
      from: 'noreply@em3594.innuendo.ovh',
      html: this.compileHandlebar(
        'forgotten_password_link',
        {
          name,
          email,
          link
        }
      ),
    };

    try {
      await this.sendgridService.send(mail);
    } catch (error) {
      throw new InternalServerErrorException("Mailing service not working")
    }
    return "email sent";
  }

  emailPreview(emailTag: string) {
    const contexts = {
      forgotten_password: { name: 'Tristan', password: 'Xv47A3k9Gaa1' },
      credentials: { name: 'Tristan', email: 'tristan.bourgeois@epitech.eu', password: 'Xv47A3k9Gaa1' },
      payment_link: { name: 'Tristan', payment_link: 'https://stripe.com' },
      newsletter_subscription: { name: 'Marie', email: 'marieclaire@gmail.com', object: 'Je veux m’informer des informations sur votre applications.' },
      newsletter: {text: 'Voila un text personalisé'},
      forgotten_password_link: { name: 'Tristan', link: 'https://innuendo-app.herokuapp.com/' }
    }
    return this.compileHandlebar(emailTag, contexts[emailTag]);
  }

  async sendEmailToContactList(contactList, text) {
    try {
      contactList.forEach(async contact => {
        const mail = {
          to: contact,
          subject: 'Nouveau message de l\'équipe Innuendo',
          from: 'noreply@em3594.innuendo.ovh',
          html: this.compileHandlebar(
            'newsletter',
            {
              text
            }
          ),
        };
        await this.sendgridService.send(mail);
      });
    } catch (error) {
      throw new InternalServerErrorException("Mailing service not working")
    }
    return "email sents";
  }

  async sendEmailToTeamInnuendo(text: string, type: string) {
    const teamEmailsTypes = [
      "contact",
      "subscription"
    ]
    if (!teamEmailsTypes.find(e => e == type)) {
      throw new NotFoundException('Type should be one of the following: ' + teamEmailsTypes);
    }
    const title = type == 'contact' ? 'Nouveau retour utilisateur' : "Nouvelle demande d'abonnement";
    try {
        const mail = {
          to: "innuendo.contact@gmail.com",
          subject: title,
          from: 'noreply@em3594.innuendo.ovh',
          html: this.compileHandlebar(
            'email_to_team',
            {
              title,
              text
            }
          ),
        };
        await this.sendgridService.send(mail);
    } catch (error) {
      throw new InternalServerErrorException("Mailing service not working")
    }
    return "email sent";
  }
}