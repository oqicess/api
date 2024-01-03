import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { NotesService } from 'src/notes/notes.service';
import { Notes } from './dto/notes.dto';

@Controller('notes')
export class NotesController {

    constructor(private readonly redisService: NotesService) {}

    @Delete('/delete')
    async deleteNotes(@Body() body: string){
        const deleteNotes = await this.redisService.deleteNotes(body)
        return deleteNotes
    }

    @Put('/update')
    async editNotes(@Body() dto: Notes){
        const updateNotes = await this.redisService.updateNotes(dto)
        return updateNotes
    }

    @Post('/create')
    async addNotes(@Body() dto: Notes ){
        const notes = await this.redisService.createNotes(dto)
        return notes
    }

    @Get('/all')
    async getAllValues() {
      const values = await this.redisService.getAllValues();
      return values;
    }


}
