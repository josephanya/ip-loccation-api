import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv";
import axios from "axios";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/hello', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const visitor_name = req.query.visitor_name;
        const client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const location = await getLocation(client_ip as string);
        const temperature = await getWeather(location.lon, location.lat);
        return res.status(400).json({
            client_ip,
            location: location.city,
            greeting: `Hello, ${visitor_name}!, the temperature is ${temperature} degrees Celcius in ${location.city}`
        })
    } catch (e) {
        next(e);
    }
});

const getLocation = async (ip: string) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        return response.data
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
}

const getWeather = async (lon: string, lat: string) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d2a6dbfec408b319c9d28c32198b4e02&units=metric`);
        return response.data.main.temp
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
}

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        message: 'server is working'
    });
});

app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        message: 'resource or endpoint not found'
    })
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.json({
        error: {
            message: err.message
        },
    });
})

app.listen(port, async () => {
    console.log(`application started on port: ${port}`)
});