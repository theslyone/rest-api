import { config } from 'dotenv'
import mongoose from 'mongoose'
import { Connection, ConnectionOptions } from 'mongoose'

export class MongoConnector {
    private mongoConnection: Connection

    constructor() {
        config({ path: '.env' })
    }

    public connect(): Promise<void> {
        return new Promise<any>((resolve, reject) => {
            const options: ConnectionOptions = {
                keepAlive: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                // @ts-ignore
                useUnifiedTopology: true
            };
            this.mongoConnection = mongoose.connection;
            mongoose.connect(process.env.MONGODB_URI, options)
                .then(() => {
                    const indexOf = process.env.MONGODB_URI.indexOf('@')
                    const db = indexOf !== -1 ?
                        process.env.MONGODB_URI.substring(0, 10) + '!_:_!' + process.env.MONGODB_URI.substring(indexOf) :
                        process.env.MONGODB_URI
                    console.log(`MongoDB connected ${db}`)
                })
                .then(resolve)
                .catch(reject)
        });
    }

    public disconnect(): Promise<void> {
        return this.mongoConnection.close()
    }
}
