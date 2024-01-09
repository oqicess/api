import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import database from 'src/database';
import PDFDocument from 'pdfkit-table';


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

        const noteGet = JSON.parse(await database.client.get(dto.id));
        
        if(!noteGet){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }

        const currentDate: Date = new Date();
        const currentDateString: string = currentDate.toISOString();
        const date: Date = new Date(currentDateString);

        const note : Message  = {
            id: noteGet.id,
            title: dto.title || noteGet.title,
            text: dto.text || noteGet.text,
            updatedAt: Math.floor(date.getTime() / 1000),
            color: dto.color || noteGet.color,
            reminder: dto.reminder || noteGet.reminder || null,
            tags: dto.tags || noteGet.tags || null,
            createdAt: noteGet.createdAt,
            expires: noteGet.expires,
            
        }

        if(noteGet.expires !== null ){
            await database.client.setEx(note.id, note.expires, JSON.stringify(note));
            return note
        }
        
        await database.client.set(note.id, JSON.stringify(note))

        return note 
    }


    async createNotes(dto): Promise<Message> {
        
        const id = randomBytes(16).toString('hex');

        const currentDate: Date = new Date();
        const currentDateString: string = currentDate.toISOString();
        const date: Date = new Date(currentDateString);

        const note : Message = {
            id: id,
            title: dto.title,
            text: dto.text,
            createdAt: Math.floor(date.getTime() / 1000),
            updatedAt: Math.floor(date.getTime() / 1000),
            color: dto.color,
            expires: dto.expires * 60 || null,
            reminder: dto.reminder || null,
            tags: dto.tags || null
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

    async generatePDF(){
        const notes = await this.getAllValues()

        const pdfBuffer: Buffer = await new Promise (resolve => {
            const doc = new PDFDocument(
                {
                    size: 'LETTER',
                    bufferPages: true, 
                }
            )
            
            Object.values(notes).forEach((value) => {       
                              
                doc.font('src/notes/fonts/Geneva.ttf');
                doc.fontSize(16).fillColor(value.color).text(`${value.title}`);
                if(value.tags){
                    doc.fontSize(8).fillColor('gray').text(`${value.tags}`)
                    doc.moveDown();
                }
                doc.fontSize(14).fillColor('black').text(`${value.text}`);
                doc.moveDown();
            });  

            const buffer = []
            doc.on('data', buffer.push.bind(buffer))
            doc.on('end', () => {
                const data = Buffer.concat(buffer)
                resolve(data)
            })
              
            doc.end()

        })
        return pdfBuffer
    }


}
