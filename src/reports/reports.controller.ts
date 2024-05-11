import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-reporp.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserEntity } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.reportsService.create(body, user);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async approveReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveReportDto,
  ) {
    return await this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    return await this.reportsService.createEstimate(query);
  }
}
