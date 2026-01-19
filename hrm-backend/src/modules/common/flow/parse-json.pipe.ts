import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
    transform(value: any): any {
        if (typeof value !== 'string') {
            throw new BadRequestException('Expected input to be a JSON string');
        }
        try {
            return JSON.parse(value);
        } catch (error) {
            throw new BadRequestException('Invalid JSON string');
        }
    }
}
