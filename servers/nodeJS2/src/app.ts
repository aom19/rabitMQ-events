// simple express server

import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { createConnection } from 'typeorm';

import * as amqp from 'amqplib/callback_api';
import { Product } from './entity/product';
import  * as dotenv from "dotenv";


dotenv.config();


createConnection().then(async connection => {

    const productRepository = connection.getMongoRepository(Product);
    amqp.connect(`amqps://${process.env.RABITMQ_USER!}:${process.env.RABITMQ_PASSWORD!}@chimpanzee.rmq.cloudamqp.com/${process.env.RABITMQ_NAME!}` ,(err0,conn) => {
     
    if(err0){
            throw err0;
        }

        
        conn.createChannel((err1,ch) => {
            if(err1){
                throw err1;
            }

            ch.assertQueue('products', {
                durable: false
            });

            ch.assertQueue('productCreated', {
                durable: false
                });
            ch.assertQueue('productUpdated', {
                durable: false
                });
            ch.assertQueue('productDeleted', {
                durable: false
                });
                
                    
            const app = express();
            app.use(bodyParser.json());
            app.use(cors());

            app.get('/api/products', async (req: Request, res: Response) => {
                const products = await productRepository.find();
                res.send(products);
            });

            app.post('/api/products/:id/like', async (req: Request, res: Response) => {
                const products:Product[] = await productRepository.find();
            
                const product :Product = products.find(p => p.id == req.params.id);
            
                
                product.likes = product.likes + 1;
                const results = await productRepository.save(product);
                // ch.sendToQueue('products', Buffer.from(JSON.stringify(results)));
                return res.json(results);
            });


            ch.consume('productCreated', async(msg) => {
              const eventProduct:Product = JSON.parse(msg.content.toString());
              const product = new Product();
                product.adminId = parseInt(eventProduct.id)
                product.title = eventProduct.title;
                product.image = eventProduct.image;
                product.likes = eventProduct.likes;
                console.log(product )
                await productRepository.save(product);
                console.log('product created');

            },{noAck: true});

            ch.consume('productUpdated', async(msg) => {
                const eventProduct:Product = JSON.parse(msg.content.toString());
                const product = await productRepository.findOne(eventProduct.id);
                product.title = eventProduct.title;
                product.image = eventProduct.image;
                product.likes = eventProduct.likes;
                await productRepository.save(product);
                console.log('product updated');
            },{noAck: true});

            ch.consume('productDeleted', async(msg) => {
                const eventProductId = parseInt(msg.content.toString());
                // const product = await productRepository.findOneAndDelete
                await productRepository.deleteOne({eventProductId});
                // await productRepository.remove(product);
                console.log('product deleted');
            },{noAck: true});


        

           


            app.listen(process.env.SERVER_PORT, () => {
                console.log(`Example app listening at http://localhost:${process.env.SERVER_PORT}`)
            })
            process.on('beforeExit', (code) => {
                conn.close();
                console.log(`Closing rabbitmq connection`);
                // process.exit();
            }
            )
        })
    })


}).catch(error => console.log(error));
