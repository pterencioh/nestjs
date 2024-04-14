import { HttpException, Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { google } from 'googleapis';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { JWTPayload } from 'src/guards/auth.guard';


@Injectable()
export class ProfilesService {
    private oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground' // Redirect URL
    );
  
    constructor(private readonly prismaService: PrismaService,
       private readonly authService: AuthService) {  }
  
    async uploadFile(file: Express.Multer.File, jwt: string): Promise<string> {
      const verifyJWT:boolean = this.authService.verifyJWTtoken(jwt);
      if(!verifyJWT)
        throw new HttpException('Invalid JWT credentials', 400);

      const decodeJWT: JWTPayload = this.authService.decodeJWTtoken(jwt);

      const getUser = await this.authService.getUser(decodeJWT.email);
      if(!getUser)
        throw new HttpException("Invalid user information", 404);

      // Configurar o cliente OAuth2 com suas credenciais
      const auth = new google.auth.GoogleAuth({
        keyFile: 'gifted-kit-397020-ef7c9e774d8e.json', // Arquivo de credenciais obtido no Console de Desenvolvedor do Google
        scopes: ['https://www.googleapis.com/auth/drive'], // Escopos necessários para acessar o Google Drive
      });

      const authClient = await auth.getClient();
        
      // Criar uma instância do serviço Google Drive
      const drive = google.drive({
            version: 'v3',
            auth: authClient as any,
      });
  
      const fileMetadata = {
        name: file.filename,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Optional: Specify the folder ID if you want to upload to a specific folder
      };
  
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path), // Assuming the file is available as a buffer
      };
  
      try {
        const response = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: 'id'
        });
        
        const fileContentLink = `https://drive.google.com/thumbnail?id=${response.data.id}`;
        const updateUser = await this.updateProfileImage(getUser.id, fileContentLink);
        if(!updateUser)
                throw new HttpException("Failed to update the current user", 400);

        const deletePreviousImage = await this.deleteFile(decodeJWT);

        const newJWT = this.authService.generateJWTtoken(updateUser.id, updateUser.name,updateUser. email, updateUser.profile_image);
        return newJWT;

      } catch (error) {
        console.error('Failed to upload file:', error);
        throw new Error('Failed to upload file to Google Drive');
      }
    }

    async updateProfileImage(userID: number, fileLink: string){
        const getUser = await this.prismaService.users.findUnique({
            where: {
                id: userID
            }
        })

        if (!getUser)
            throw new HttpException("Invalid user information", 404);

        return await this.prismaService.users.update({
            where: {
                id: userID
            },
            data: {
                profile_image: fileLink
            }
        })

    }

    async deleteFile(previousJWT: JWTPayload) : Promise<void> {
        const isGoogleDriveUpload: boolean = previousJWT.profile_image.startsWith("https://drive.google.com/thumbnail?id=");
        if(!isGoogleDriveUpload)
            return

        const defaultImages = JSON.parse(process.env.DEFAULT_PROFILE_IMAGES);
        const fileId: string  = previousJWT.profile_image.replace(/^https:\/\/drive\.google\.com\/thumbnail\?id=/, '');

        const isFileIdDefault: boolean = (defaultImages.filter((image: { [key: string]: string; }) => Object.values(image).includes(fileId))[0]);
        if(isFileIdDefault)
            return

        // Configurar o cliente OAuth2 com suas credenciais
        const auth = new google.auth.GoogleAuth({
            keyFile: 'gifted-kit-397020-ef7c9e774d8e.json', // Arquivo de credenciais obtido no Console de Desenvolvedor do Google
            scopes: ['https://www.googleapis.com/auth/drive'], // Escopos necessários para acessar o Google Drive
        });
        
        // Criar um cliente OAuth2
        const authClient = await auth.getClient();
        
        // Criar uma instância do serviço Google Drive
        const drive = google.drive({
            version: 'v3',
            auth: authClient as any,
        });
        
        try {
              const deleteFile = await drive.files.delete({ fileId });
        } catch (error) {
            throw new HttpException("Error: " + error, 500);
        }
    }
}
  