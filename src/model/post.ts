import mongoose from 'mongoose'
import { Model } from 'mongoose'

const { Schema, model } = mongoose
const { ObjectId } = Schema.Types

export type PostType = Post & mongoose.Document

export interface Post {
    _id?: string
    assetId: string,
    title: string
    content: string
    category: string
}

const PostSchema = new Schema({
    assetId: {
        ref: 'asset',
        type: ObjectId
    },
    category: String,
    content: String,
    title: String,

}, { timestamps: true, versionKey: false })

const PostModel: Model<PostType> = model<PostType>('post', PostSchema)
export default PostModel
