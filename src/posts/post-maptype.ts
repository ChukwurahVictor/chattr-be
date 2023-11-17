import { CrudMapType } from '../common/database/crud-service';
import { Prisma } from '@prisma/client';

export class PostMapType implements CrudMapType {
  aggregate: Prisma.PostAggregateArgs;
  count: Prisma.PostCountArgs;
  create: Prisma.PostCreateArgs;
  delete: Prisma.PostDeleteArgs;
  deleteMany: Prisma.PostDeleteManyArgs;
  findFirst: Prisma.PostFindFirstArgs;
  findMany: Prisma.PostFindManyArgs;
  findUnique: Prisma.PostFindUniqueArgs;
  update: Prisma.PostUpdateArgs;
  updateMany: Prisma.PostUpdateManyArgs;
  upsert: Prisma.PostUpsertArgs;
}
