import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class AlcTypeService {
  constructor(private dbService: DbService) {}

  getAllAlcTypes() {
    return this.dbService.alcType.findMany();
  }
}
