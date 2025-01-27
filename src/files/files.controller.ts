import { Controller, Get, Post, Param, UploadedFile, UseInterceptors,
  BadRequestException,  
  Res} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { envs } from 'src/config/envs';



@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 50000},
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }) )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File) {

      
      if ( !file  ) {
        throw new BadRequestException('No hay archivo o el tamaño supera los 50Kb');
      }

      const secureUrl = `${envs.hostApi}/files/product/${file.filename}`;


    return {
      secureUrl
    }
  }


  @Get('product/:imageName')
  findOneProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string ) {


    const path = this.filesService.getStaticProductImage( imageName );

    return res.sendFile ( path );


  }
 
}
