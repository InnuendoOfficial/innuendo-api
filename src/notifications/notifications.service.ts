import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import fetch from 'node-fetch';

function SendNotificationTodayReport(device_Ids) { 
    const template = {
        app_id: process.env.ONESIGNAL_APP_ID,
        template_id: "5dfbc872-02f0-4e7f-b0c7-b2359eb71928",
        data: {foo: "bar"},
        include_player_ids: device_Ids
    };
    fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Notification sent successfully:', data);
    })
    .catch(error => {
        console.error('Error when sending the notification:', error);
    });
}

function SendNotificationYesterdayReport(device_Ids) { 
    const template = {
        app_id: process.env.ONESIGNAL_APP_ID,
        template_id: "1d665877-a3c8-4d97-b5a3-39bb3e985d84",
        data: {foo: "bar"},
        include_player_ids: device_Ids
    };
    fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Notification sent successfully:', data);
    })
    .catch(error => {
        console.error('Error when sending the notification:', error);
    });
}

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}
    private readonly logger = new Logger(NotificationsService.name);

    // '30 * * * * *'
    //'0 0 20 * * *' 20h soir 
    @Cron('0 0 20 * * *')
    async cronTodaydayReport() {
        let device_Ids = []
        let todayMax = new Date()
        let todayMin = new Date()
        todayMax.setHours(23);
        todayMax.setMinutes(59);

        todayMin.setHours(0);
        todayMin.setMinutes(1);

        try {
            const usersWithoutReportToday = await this.prisma.user.findMany({
                where: {
                    NOT: {
                        reports: {
                            some: {
                                AND: [
                                    {date: {lte: todayMax}},
                                    {date: {gte: todayMin}},
                                ]
                            }
                        }
                    }
                }
            });
            console.log("User without report Today")
            console.log(usersWithoutReportToday)
            usersWithoutReportToday.forEach(user => {
                if (user.device_id !== null) {
                    device_Ids.push(user.device_id);
                }
            });
            SendNotificationTodayReport(device_Ids)
        } catch (error) {
            console.log(error)
        }
    }

    // '0 30 12 * * *' midi et demi
    @Cron('0 30 12 * * *')
    async cronYesterdayReport() {
        let device_Ids = []
        let yesterdayMax = new Date();
        let yesterdayMin = new Date();

        yesterdayMin.setDate(yesterdayMin.getDate() - 1);
        yesterdayMax.setDate(yesterdayMax.getDate() - 1);
        yesterdayMax.setHours(23);
        yesterdayMax.setMinutes(59);

        yesterdayMin.setHours(0);
        yesterdayMin.setMinutes(1);

        try {
            const usersWithoutReportYesterday = await this.prisma.user.findMany({
                where: {
                    NOT: {
                        reports: {
                            some: {
                                AND: [
                                    {date: {lte: yesterdayMax}},
                                    {date: {gte: yesterdayMin}},
                                ]
                            }
                        }
                    }
                }
            });
            console.log("User without report Yesterday")
            console.log(usersWithoutReportYesterday);
            usersWithoutReportYesterday.forEach(user => {
                if (user.device_id !== null) {
                    device_Ids.push(user.device_id);
                }
            });
            SendNotificationYesterdayReport(device_Ids);
        } catch (error) {
            console.log(error);
        }
    }
}
