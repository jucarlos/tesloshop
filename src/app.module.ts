import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { HealthCheckModule } from './health-check/health-check.module';



@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
     // port: envs.dePort,
      username: envs.dbUser,
      password: envs.dbPassword,
      database: envs.dbName,
      ssl: true,
      autoLoadEntities: true,
      synchronize: envs.deEntorno === 'PRODUCCION' ? true : true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,

    HealthCheckModule,




  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
