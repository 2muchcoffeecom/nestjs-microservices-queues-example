import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { fromEvent, interval } from 'rxjs';
import { filter, switchMap, switchMapTo } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectQueue('scheduler') private readonly schedulerQueue: Queue
  ) {
    interval(1000)
    .pipe(
      switchMap(() => {
        return fromPromise(this.schedulerQueue.count())
      }),
      filter(count => count > 5)
    )
    .subscribe(count => {
      this.logger.log(`ALERT: ${count} jobs in the queue, improve your server`);
    })

    // Add default interval
    // this.createSchedulerInterval('testInterval', 5000);
  }

  add(data: {providerId: string, delay: number}) {
    this.createSchedulerInterval(data.providerId);
  }

  private createSchedulerInterval(id: string, delay = 10000){
    const callback = async () => {
      this.logger.log(`Provider ${id} added to queue`);
      await this.schedulerQueue.add('executeScheduler', {providerId: id});
    };

    const interval = setInterval(callback, delay);
    this.schedulerRegistry.addInterval(id, interval);
  }

  getAll(){
    return this.schedulerRegistry.getIntervals();
  }
}
