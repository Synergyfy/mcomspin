import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/roles.constant';
import { SuperAdminGuard } from '../guards/super-admin.guard';
import { AdminGamesService } from '../services/admin-games.service';
import { UpdateGameDto } from '../dto/update-game.dto';

@ApiTags('Admin - Games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, SuperAdminGuard)
@Roles(Role.SuperAdmin)
@Controller('admin/games')
export class AdminGamesController {
  constructor(private readonly adminGamesService: AdminGamesService) {}

  @Get()
  @ApiOperation({ summary: 'List all games with configs' })
  findAll() {
    return this.adminGamesService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update game configuration' })
  update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.adminGamesService.update(id, dto);
  }
}
