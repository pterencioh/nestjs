import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { promises as fsPromises } from 'fs';
import { ProfilesService } from './profiles.service';
import { profileDto } from '../dtos/auth.dto';
const { unlink } = fsPromises;

const storage = diskStorage({
    destination: process.env.UPLOAD_FOLDER_TEMPORARY,  // Diretório onde os arquivos serão salvos
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtName = extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
        callback(null, fileName);
    }
});

@Controller('api/profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService){ }

    @Post('/:jwt')
    @UseInterceptors(FileInterceptor('image', {
        storage: storage
    }))

    async uploadProfileImage(@UploadedFile() image, @Param('jwt') jwt: string) {
        try {
            const result = await this.profilesService.uploadFile(image, jwt);
            await unlink(image.path);

            return { message: 'File uploaded successfully', jwt: result };
  
          } catch (error) {
            throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }
}
