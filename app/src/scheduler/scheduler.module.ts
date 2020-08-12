import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SchedulerProcessor } from './scheduler.processor';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SchedulerController } from './schedulerController';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCHEDULER_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`,
        }
      },
    ]),
    BullModule.registerQueue({
      name: 'scheduler',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379
      }
    }),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerProcessor],
})
export class SchedulerModule {}
