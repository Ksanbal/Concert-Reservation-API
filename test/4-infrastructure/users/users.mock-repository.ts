import { UsersModel } from 'src/3-domain/users/users.model';

const mockData: UsersModel[] = [
  new UsersModel({ id: 1, name: '카리나' }),
  new UsersModel({ id: 2, name: '윈터' }),
];

export const UsersMockRepository = {
  findById: jest.fn((id: number) => {
    return mockData.find((user) => user.id === id);
  }),
};
