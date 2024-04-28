import { Controller, Get } from '@nestjs/common';
import { AlcTypeService } from './alcType.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('alcType')
export class AlcTypeController {
  constructor(private alcTypeService: AlcTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alc types' })
  async getAlcTypes(): Promise<any> {
    return this.alcTypeService.getAllAlcTypes();
  }
}
