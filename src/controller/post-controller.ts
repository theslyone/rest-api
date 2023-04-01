import { Inject } from 'typescript-ioc'
import { DELETE, Errors, GET, Path, PathParam, POST, PreProcessor, PUT, QueryParam } from 'typescript-rest'
import { Post } from '../model/post'
import { PostService } from '../service/post-service'
import postSchema from '../validation/post'
import validate from '../validation/validate'

@Path('/posts')
export class PostController {
    constructor(@Inject private postService: PostService) { }

    @POST
    @PreProcessor(validate(postSchema.create))
    public create(data: Post): Promise<Post> {
        return this.postService.create(data)
    }

    @PUT
    @Path(':id')
    @PreProcessor(validate(postSchema.update))
    public async update(@PathParam('id') id: string, data: Post): Promise<Post> {
        const updatedPost = await this.postService.update(id, data)
        if (!updatedPost) {
            throw new Errors.NotFoundError(`post not found`)
        }

        return updatedPost
    }

    @DELETE
    @Path(':id')
    @PreProcessor(validate(postSchema.delete))
    public async delete(@PathParam('id') id: string): Promise<void> {
        const deletedPost = await this.postService.delete(id)
        if (!deletedPost) {
            throw new Errors.NotFoundError(`post not found`)
        }
    }

    @GET
    @PreProcessor(validate(postSchema.getAll))
    public getAll(
        @QueryParam('category') category?: string,
        @QueryParam('sort') sort?: 'asc' | 'desc'): Promise<Array<Post>> {
        const condition: Record<string, unknown> = {}
        if (category) {
            condition['category'] = category
        }
        return this.postService.getAll(condition, { createdAt: sort || 'desc' })
    }

    @GET
    @Path(':id')
    @PreProcessor(validate(postSchema.getById))
    public async get(@PathParam('id') id: string): Promise<Post> {
        const post = await this.postService.getById(id)
        if (!post) {
            throw new Errors.NotFoundError(`post not found`)
        }

        return post
    }
}
