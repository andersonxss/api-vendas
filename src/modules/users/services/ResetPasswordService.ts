import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { isAfter, addHours } from 'date-fns';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token User does not exists.');
    }

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreateAT = userToken.created_at;
    const compareDate = addHours(tokenCreateAT, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await hash(password, 8);
    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
