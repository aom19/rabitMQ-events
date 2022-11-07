import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import {createConnection } from 'typeorm'
import {Request , Response} from 'express'
import {Product} from './entity/product'

import * as amqp from 'amqplib/callback_api';

createConnection().then(connection => {
    const port = 8000;
    const productRepository = connection.getRepository(Product);

    amqp.connect('amqps://nebyilix:oc2I9Q3cG02xLvO4l6ouRF84KLjeLTtj@chimpanzee.rmq.cloudamqp.com/nebyilix' ,(err0,conn) => {
        if(err0){
            throw err0;
        }

        conn.createChannel((err1,ch) => {
            if(err1){
                throw err1;
            }
            const app = express();
            //config dotenv
            dotenv.config({
                path: '../.env'
            });
            
            app.use(cors(
                {
                    origin : 'http://localhost:3000'
                }
            ));
             
            app.use(express.json());
        
            app.get('/api/products', async (req:Request, res : Response) => {
                const products = await  productRepository.find();
              
                res.json(products);
        
            });

            app.post('/api/products', async (req:Request, res : Response) => {
                const product = await productRepository.create(req.body);
                const results = await productRepository.save(product);
                ch.sendToQueue('productCreated', Buffer.from(JSON.stringify(results)));
                return res.json(results);
            });
            app.delete('/api/products/:id', async (req:Request, res : Response) => {
                const results = await productRepository.delete(req.params.id);
                ch.sendToQueue('productDeleted', Buffer.from(JSON.stringify(req.params.id)));
                return res.json(results);
            });
            app.put('/api/products/:id', async (req:Request, res : Response) => {
               
                const product = await productRepository.findOne(req.params.id);
                productRepository.merge(product, req.body);
        
                const results = await productRepository.save(product);
                ch.sendToQueue('productUpdated', Buffer.from(JSON.stringify(results)));
                return res.json(results);
            });
        
            app.post('/api/products/:id/like', async (req:Request, res : Response) => {
                const product = await productRepository.findOne(req.params.id);
                product.likes++;
                const results = await productRepository.save(product);
                return res.json(results);
            });
            
        
            
            
            app.listen(port, () => {
                console.log('Server started on port '+port);
                }
            );
            // console.log(connection)
            
        })
    })

  

}).catch(error => console.log(error));
