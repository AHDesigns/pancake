require('module-alias/register');
require('dotenv').config({ path: './.env.local' });
import EventEmitter from 'events';
import { Server } from 'http';
import socket from 'socket.io';

import { app } from './app';
import setUpSocket from './socket';
import createRouter from './router';
import { port } from './helpers/config';
import log from './helpers/logger';
import cacheSystem from './helpers/cache';
import pollGithubForChanges from './requester';
import { TServerInfo } from './types';

const http = new Server(app);
const io = socket(http);

const sharedInfo: TServerInfo = {
    cache: cacheSystem(),
    reviewEmitter: new EventEmitter(),
    watchedRepos: {},
};

createRouter(app, sharedInfo.cache);

io.on('connections', setUpSocket(sharedInfo));
pollGithubForChanges(sharedInfo);

http.listen(port, () => {
    log.info('app.start', {
        port,
        logLevel: log.level,
        env: process.env.NODE_ENV,
    });
});
