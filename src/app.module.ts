import { Module } from "@nestjs/common";
import { NotesModule } from './notes/notes.module';

@Module({
    controllers: [],
    providers: [],
    imports: [NotesModule],
})
export class AppModule {}