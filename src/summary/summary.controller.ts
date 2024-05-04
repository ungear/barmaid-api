import { Controller, Get } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('summary')
export class SummaryController {
  constructor(private summaryService: SummaryService) {}

  private summaryCache = null;

  @Get('/count')
  @ApiOperation({ summary: 'Get total number of drinks and ingredients' })
  async getCount(): Promise<any> {
    if(this.summaryCache) return this.summaryCache;

    const summaryData = await this.summaryService.getSummary();
    // caching summary data forever. We suppose that the number of drinks will be rarely changed
    this.summaryCache = summaryData;
    return this.summaryCache;
  }
}
