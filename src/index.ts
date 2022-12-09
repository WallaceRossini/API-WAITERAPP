import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import http from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import { router } from './router';

const port = 4000;
const app = express();
const server = http.createServer(app);

export const io = new Server(server);

mongoose.connect('mongodb://localhost:27017')
  .then(() => {

    // app.use(cors());

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', '*'); //* = WILDCARD('carta coringa')
      res.setHeader('Access-Control-Allow-Headers', '*');

      next();
    });

    app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

    app.use(express.json());

    app.use(router);

    io.on('connection', (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);
      socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
      });
    });

    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  })
  .catch(() => console.log('erro ao conectar no mongodb'));
