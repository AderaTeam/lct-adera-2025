import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectoriesModule } from 'src/directories/directories.module';

@Module({
  imports: [DirectoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
