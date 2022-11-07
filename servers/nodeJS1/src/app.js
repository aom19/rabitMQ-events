"use strict";
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
var cors = require("cors");
var dotenv = require("dotenv");
var typeorm_1 = require("typeorm");
var product_1 = require("./entity/product");
var amqp = require("amqplib/callback_api");
(0, typeorm_1.createConnection)().then(function (connection) {
    var port = 8000;
    var productRepository = connection.getRepository(product_1.Product);
    amqp.connect('amqps://nebyilix:oc2I9Q3cG02xLvO4l6ouRF84KLjeLTtj@chimpanzee.rmq.cloudamqp.com/nebyilix', function (err0, conn) {
        if (err0) {
            throw err0;
        }
        conn.createChannel(function (err1, ch) {
            if (err1) {
                throw err1;
            }
            var app = express();
            //config dotenv
            dotenv.config({
                path: '../.env'
            });
            app.use(cors({
                origin: 'http://localhost:3000'
            }));
            app.use(express.json());
            app.get('/api/products', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var products;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.find()];
                        case 1:
                            products = _a.sent();
                            res.json(products);
                            return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/products', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.create(req.body)];
                        case 1:
                            product = _a.sent();
                            return [4 /*yield*/, productRepository.save(product)];
                        case 2:
                            results = _a.sent();
                            ch.sendToQueue('productCreated', Buffer.from(JSON.stringify(results)));
                            return [2 /*return*/, res.json(results)];
                    }
                });
            }); });
            app.delete('/api/products/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.delete(req.params.id)];
                        case 1:
                            results = _a.sent();
                            ch.sendToQueue('productDeleted', Buffer.from(JSON.stringify(req.params.id)));
                            return [2 /*return*/, res.json(results)];
                    }
                });
            }); });
            app.put('/api/products/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.findOne(req.params.id)];
                        case 1:
                            product = _a.sent();
                            productRepository.merge(product, req.body);
                            return [4 /*yield*/, productRepository.save(product)];
                        case 2:
                            results = _a.sent();
                            ch.sendToQueue('productUpdated', Buffer.from(JSON.stringify(results)));
                            return [2 /*return*/, res.json(results)];
                    }
                });
            }); });
            app.post('/api/products/:id/like', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                var product, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productRepository.findOne(req.params.id)];
                        case 1:
                            product = _a.sent();
                            product.likes++;
                            return [4 /*yield*/, productRepository.save(product)];
                        case 2:
                            results = _a.sent();
                            return [2 /*return*/, res.json(results)];
                    }
                });
            }); });
            app.listen(port, function () {
                console.log('Server started on port ' + port);
            });
            // console.log(connection)
        });
    });
}).catch(function (error) { return console.log(error); });
