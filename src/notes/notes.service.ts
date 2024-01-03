import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import database from 'src/database';

@Injectable()
export class NotesService {

    async deleteNotes(body): Promise<HttpStatus> {

        const notes = JSON.parse(await database.client.get(body.id));
        
        if(!notes){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        
        await database.client.del(body.id)
        throw new HttpException('OK', HttpStatus.OK)
        
    }

    async updateNotes(dto): Promise<Message> {

        const notes = JSON.parse(await database.client.get(dto.id));
        
        if(!notes){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }

        const note : Message = {
            id: notes.id,
            title: dto.title,
            message: dto.message,
            date: new Date(),
            color: dto.color,
            expires: dto.expires * 60 || null,
        }

        if(note.expires !== null ){
            await database.client.setEx(note.id, note.expires, JSON.stringify(note));
            return note
        }
        
        await database.client.set(note.id, JSON.stringify(note))

        return note 
    }


    async createNotes(dto): Promise<Message> {
        const id = randomBytes(16).toString('hex');
        const note : Message = {
            id: id,
            title: dto.title,
            message: dto.message,
            date: new Date(),
            color: dto.color,
            expires: dto.expires * 60 || null,
        }

        if(note.expires !== null ){
            await database.client.setEx(id, note.expires, JSON.stringify(note));
            return note
        }
        await database.client.set(id, JSON.stringify(note))
    
        return note
    }
        

    async getAllValues(): Promise<object> {
        const keys = await database.client.keys('*');
        const values = await Promise.all(keys.map((key) => database.client.get(key)));
        const parsedData = values.map((item) => JSON.parse(item));
        
        return parsedData;
      }


}
