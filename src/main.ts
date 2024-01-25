import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import database from './database';
import config from './config';

async function start() {

    const app = await NestFactory.create(AppModule, {cors: true});

    database.connect()
        .then(() => {
            app.listen(config.app.port, () => {
                console.log(`Server listening on port ${config.app.port}`);
            });
        });
}

start();
