import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private prismaService: PrismaService) {}

  async create() {
    return 'Create Reaction';
  }

  async getAllReactions() {
    return 'Get all Reactions';
  }

  async getAReaction() {
    return 'Get a reaction';
  }

  async updateReaction() {
    return 'Update Reaction';
  }

  async removeReaction() {
    return 'Delete Reaction';
  }
}