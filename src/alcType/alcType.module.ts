import { Module } from '@nestjs/common';
import { AlcTypeService } from './alcType.service';
import { AlcTypeController } from './alcType.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [AlcTypeService],
  controllers: [AlcTypeController],
  imports: [DbModule],
})
export class AlcTypeModule {}
