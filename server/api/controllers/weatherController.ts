import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../../config/errors'
import request from 'request'
const key = process.env.API_KEY

async function fetchWeather(req: Request, res: Response, next: NextFunction) {
  const promise = new Promise(function(resolve, reject) {
    request('http://ipinfo.io', function(error: any, response: any, body: any) {
      if (!error && body) {
        const city = JSON.parse(body).city
        resolve(city)
      } else {
        reject(error)
        new HttpError(error)
      }
    })
  })
    .then(
      (city: string) =>
        new Promise(function(resolve, reject) {
          request(
            `http://openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`,
            function(error: any, response: any, body: any) {
              if (!error && body) {
                const weather = JSON.parse(body)
                resolve(weather)
              } else {
                reject(error)
                new HttpError(error)
              }
            }
          )
        })
    )
    .then((data: any) => {
      const obj = {
        city: data.name,
        weather: data.weather['main'],
        temperature: { min: data.main.temp_min, man: data.main.temp_max }
      }
      res.status(200).json(obj)
    })
}

export default fetchWeather
