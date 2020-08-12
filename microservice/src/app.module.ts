import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'scheduler',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
