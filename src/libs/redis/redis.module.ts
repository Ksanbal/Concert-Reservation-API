import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule], // ConfigModule을 임포트합니다.
    //   useFactory: async (configService: ConfigService) => ({}),
    //   inject: [ConfigService], // ConfigService를 주입합니다.
    // }),
    RedisModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 임포트합니다.
      //   useFactory: async (configService: ConfigService) => ({}),
      useFactory: async (configService: ConfigService) => ({
        readyLog: true,
        config: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService], // ConfigService를 주입합니다.
    }),
  ],
})
export class MyRedisModule {}
