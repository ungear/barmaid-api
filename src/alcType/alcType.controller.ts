import { Controller, Get } from '@nestjs/common';
import { AlcTypeService } from './alcType.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AlcTypeEntity } from 'src/entities/alcType.entity';

@Controller('alcType')
export class AlcTypeController {
  constructor(private alcTypeService: AlcTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alc types' })
  @ApiOkResponse({ type: [AlcTypeEntity] })
  async getAlcTypes(): Promise<any> {
    return this.alcTypeService.getAllAlcTypes();
  }
}
