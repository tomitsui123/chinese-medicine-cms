import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Chinese Medicine Clinic API is running!';
  }
}
