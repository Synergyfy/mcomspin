import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateGameDto } from '../dto/update-game.dto';

@Injectable()
export class AdminGamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.game.findMany({
      include: { configs: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateGameDto) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');

    return this.prisma.game.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        isActive: dto.isActive,
      },
    });
  }
}
