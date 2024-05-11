import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-reporp.dto';
import { UserEntity } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepo: Repository<ReportEntity>,
  ) {}

  async create(reportDto: CreateReportDto, user: UserEntity) {
    const report = this.reportRepo.create(reportDto);
    report.user = user;
    return await this.reportRepo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;
    return await this.reportRepo.save(report);
  }

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return await this.reportRepo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      // .getRawMany();
      .getRawOne();
  }
}
