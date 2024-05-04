import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [SummaryService],
  controllers: [SummaryController],
  imports: [DbModule],
})
export class SummaryModule {}