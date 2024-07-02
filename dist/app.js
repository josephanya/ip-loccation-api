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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const request_ip_1 = __importDefault(require("request-ip"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(request_ip_1.default.mw());
app.get('/api/hello', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitor_name = req.query.visitor_name;
        const client_ip = req.clientIp;
        const location = yield getLocation(client_ip);
        const temperature = yield getWeather(location.lon, location.lat);
        return res.status(400).json({
            client_ip,
            location: location.city,
            greeting: `Hello, ${visitor_name}!, the temperature is ${temperature} degrees Celcius in ${location.city}`
        });
    }
    catch (e) {
        next(e);
    }
}));
const getLocation = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`http://ip-api.com/json/${ip}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
});
const getWeather = (lon, lat) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d2a6dbfec408b319c9d28c32198b4e02&units=metric`);
        return response.data.main.temp;
    }
    catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
});
app.get('/', (req, res, next) => {
    res.json({
        message: 'server is working'
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'resource or endpoint not found'
    });
});
app.use((err, req, res, next) => {
    return res.json({
        error: {
            message: err.message
        },
    });
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`application started on port: ${port}`);
}));
