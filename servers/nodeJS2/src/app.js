"use strict";
// simple express server
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var typeorm_1 = require("typeorm");
var amqp = require("amqplib/callback_api");
var product_1 = require("./entity/product");
var port = 8001;
(0, typeorm_1.createConnection)().then(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    var productRepository;
    return __generator(this, function (_a) {
        productRepository = connection.getMongoRepository(product_1.Product);
        amqp.connect('amqps://nebyilix:oc2I9Q3cG02xLvO4l6ouRF84KLjeLTtj@chimpanzee.rmq.cloudamqp.com/nebyilix', function (err0, conn) {
            if (err0) {
                throw err0;
            }
            conn.createChannel(function (err1, ch) {
                if (err1) {
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
                var app = express();
                app.use(bodyParser.json());
                app.use(cors());
                app.get('/api/products', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var products;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, productRepository.find()];
                            case 1:
                                products = _a.sent();
                                res.send(products);
                                return [2 /*return*/];
                        }
                    });
                }); });
                ch.consume('productCreated', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                    var eventProduct, product;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                eventProduct = JSON.parse(msg.content.toString());
                                product = new product_1.Product();
                                product.adminId = parseInt(eventProduct.id);
                                product.title = eventProduct.title;
                                product.image = eventProduct.image;
                                product.likes = eventProduct.likes;
                                console.log(product);
                                return [4 /*yield*/, productRepository.save(product)];
                            case 1:
                                _a.sent();
                                console.log('product created');
                                return [2 /*return*/];
                        }
                    });
                }); }, { noAck: true });
                ch.consume('productUpdated', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                    var eventProduct, product;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                eventProduct = JSON.parse(msg.content.toString());
                                return [4 /*yield*/, productRepository.findOne(eventProduct.id)];
                            case 1:
                                product = _a.sent();
                                product.title = eventProduct.title;
                                product.image = eventProduct.image;
                                product.likes = eventProduct.likes;
                                return [4 /*yield*/, productRepository.save(product)];
                            case 2:
                                _a.sent();
                                console.log('product updated');
                                return [2 /*return*/];
                        }
                    });
                }); }, { noAck: true });
                ch.consume('productDeleted', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                    var eventProductId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                eventProductId = parseInt(msg.content.toString());
                                // const product = await productRepository.findOneAndDelete
                                return [4 /*yield*/, productRepository.deleteOne({ eventProductId: eventProductId })];
                            case 1:
                                // const product = await productRepository.findOneAndDelete
                                _a.sent();
                                // await productRepository.remove(product);
                                console.log('product deleted');
                                return [2 /*return*/];
                        }
                    });
                }); }, { noAck: true });
                app.listen(port, function () {
                    console.log("Example app listening at http://localhost:".concat(port));
                });
                process.on('beforeExit', function (code) {
                    conn.close();
                    console.log("Closing rabbitmq connection");
                    // process.exit();
                });
            });
        });
        return [2 /*return*/];
    });
}); }).catch(function (error) { return console.log(error); });
