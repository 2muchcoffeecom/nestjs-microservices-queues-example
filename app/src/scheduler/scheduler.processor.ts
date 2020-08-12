import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('scheduler')
export class SchedulerProcessor {
  private readonly logger = new Logger(SchedulerProcessor.name);

  @Process({
    name: 'executeScheduler',
    concurrency: 1
  })
  async executeScheduler(job: Job<{ providerId: string }>): Promise<any> {
    const { providerId } = job.data;
    return new Promise(resolve => {
      this.logger.log(`Start fetch... ${providerId}`);
      setTimeout(() => {
        const mockData = {
          providerId: job.data,
          date: Date()
        };
        this.logger.log(`Fetch completed ${providerId}`);
        resolve(mockData)
      }, 10000)
    })
  }
}
