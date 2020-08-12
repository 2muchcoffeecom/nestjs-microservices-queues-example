import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @MessagePattern('add')
  add(data: {providerId: string, delay: number})  {
    return this.appService.add(data)
  }

  @MessagePattern('getAll')
  getAll()  {
    return this.appService.getAll()
  }
}
