import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiProperty } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { mapTo, tap } from 'rxjs/operators';

export class AddSchedulerDto {
  @ApiProperty({
    type: Number,
    default: 5000,
  })
  intervalDelay: number;
}

@Controller()
export class SchedulerController {
  private readonly logger = new Logger(SchedulerController.name);

  constructor(
    @Inject('SCHEDULER_SERVICE') private client: ClientProxy,
    @InjectQueue('scheduler') private readonly schedulerQueue: Queue
  ) {}

  @Get('getAllSchedulers')
  getAllSchedulers() {
    return this.client.send<number>('getAll', {})
  }

  @Get('getAllQueue')
  getAllQueue() {
    return this.schedulerQueue.getJobs([
      'waiting',
      'active',
      'delayed',
    ])
  }

  @Post('add')
  addScheduler(
    @Body() { intervalDelay }: AddSchedulerDto
  ) {
    const providerId = Math.random().toString(36).substring(7);
    const data = {
      providerId,
      delay: intervalDelay || 5000
    };

    this.logger.log(`Send Data to Microservice: ${JSON.stringify(data)}`);

    return this.client.send<number, {providerId: string, delay: number}>('add', data)
    .pipe(
      tap(res => {
        this.logger.log(`Provider ${providerId} added to queue`);
      }),
      mapTo(`Provider ${providerId} added to queue`)
    )
  }
}
