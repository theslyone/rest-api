import PostModel, { Post } from '../model/post'
import { IService } from './service'

export class PostService implements IService<Post> {
  public async create(post: Post) {
    return PostModel.create(post)
  }

  public async update(id: string, post: Post) {
    return PostModel.findOneAndUpdate({ _id: id }, post, { new: true }).exec()
  }

  public async delete(id: string) {
    return PostModel.findByIdAndRemove(id).exec()
  }

  public async getAll(
    condition: Record<string, unknown> = {},
    sort: Record<string, unknown> = { createdAt: 'desc' }
  ) {
    return PostModel.find(condition).sort(sort).exec()
  }

  public async getById(id: string) {
    return PostModel.findById(id).exec()
  }
}
