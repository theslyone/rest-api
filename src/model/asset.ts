import mongoose from 'mongoose'
import { Model } from 'mongoose'

const { Schema, model } = mongoose

type AssetType = Asset & mongoose.Document

export interface Asset {
    _id?: string
    contentType: string
    fileSize: number
    fileName: string
}

const AssetSchema = new Schema({
    contentType: String,
    fileSize: Number,
    filename: String
}, { timestamps: true, versionKey: false })

const AssetModel: Model<AssetType> = model<AssetType>('asset', AssetSchema)
export default AssetModel
