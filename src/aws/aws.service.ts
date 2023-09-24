import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
    constructor(private config: ConfigService) { }

    s3 = new AWS.S3({
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    });

    async uploadFile(file) {
        const { originalname } = file;

        return await this.s3Upload(
            file.buffer,
            this.config.get('AWS_S3_BUCKET'),
            originalname,
            file.mimetype,
        );
    }

    private async s3Upload(file, bucket, name, mimetype) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: 'ap-south-1',
            },
        };

        try {
            let s3Response = await this.s3.upload(params).promise();
            return s3Response;
        } catch (error) {
            throw error;
        }
    }
}
