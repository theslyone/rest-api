import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import http from 'http'
import morgan from 'morgan'
import { Server } from 'typescript-rest'
import { HttpError } from 'typescript-rest/dist/server/model/errors'

export class ApiServer {
    public PORT: number = +process.env.PORT || 3000

    private readonly app: express.Application
    private server: http.Server = null

    constructor() {
        this.app = express()
        this.config()

        Server.useIoC()
        Server.loadServices(this.app, 'controller/*', __dirname)

        this.app.use((err: HttpError, _: Request, res: Response, __: NextFunction) => {
            const { statusCode, message } = err
            res.status(statusCode).send({ message })
        })
    }

    public async start() {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err)
                }

                return resolve(`Listening to http://127.0.0.1:${this.PORT}`)
            })
        }).then(console.log)

    }

    public async stop(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true)
                })
            } else {
                return resolve(true)
            }
        })
    }

    private config(): void {
        this.app.use(cors())
        this.app.use(morgan('tiny'))
    }
}