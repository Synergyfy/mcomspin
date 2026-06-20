import { SetMetadata } from '@nestjs/common';
import { BOROUGH_SCOPED_KEY } from '../guards/borough-scope.guard';

export const BoroughScoped = () => SetMetadata(BOROUGH_SCOPED_KEY, true);
