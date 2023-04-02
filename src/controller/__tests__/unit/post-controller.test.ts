import { PostController } from "../../post-controller"
import { PostType } from "../../../model/post"
import { PostService } from "../../../service/post-service"
import { mockOf } from "../../../__tests__/mockOf"

describe('Unit - PostService', () => {
  const postService = mockOf<PostService>()
  const postController = new PostController(postService)

  describe('GET', () => {
    it('should return 404', async () => {
      postService.getById.mockResolvedValue(null)
      const unknownId = '1'
      expect(postController.get(unknownId)).rejects.toThrow('post not found')
    })

    it('should get post by id', async () => {
      const mockPost = mockOf<PostType>({
        _id: '1234',
        assetId: 'asset_id',
        category: 'test',
        content: 'test',
        title: 'test',
      })

      postService.getById.mockResolvedValue(mockPost)
      const result = await postController.get(mockPost._id)
      expect(result).toEqual(mockPost)
      expect(postService.getById).toHaveBeenNthCalledWith(1, mockPost._id)
    })

    it('should get a list of posts', async () => {
      const mockPosts = Array(5).fill(0).map((_, idx) => (
        mockOf<PostType>({
          _id: `${idx}`,
          assetId: 'asset_id',
          category: 'test',
          content: `test ${idx}`,
          title: `test ${idx}`,
        })
      ))


      postService.getAll.mockImplementation((condition) => {
        const result = condition.category ? mockPosts.filter(p => p.category === condition.category) : mockPosts
        return Promise.resolve(result)
      })

      {
        const result = await postController.getAll()
        expect(result.length).toEqual(mockPosts.length)
        expect(postService.getAll).toHaveBeenCalledTimes(1)
      }

      {
        // filtering by category
        let result = await postController.getAll('test')
        expect(result.length).toEqual(mockPosts.length)

        result = await postController.getAll('random')
        expect(result.length).toEqual(0)
      }
    })
  })

  it('should create a post', async () => {
    const mockPost = mockOf<PostType>({
      assetId: 'asset_id',
      category: 'test',
      content: 'test',
      title: 'test',
    })

    postService.create.mockResolvedValue(mockPost)
    const result = await postController.create(mockPost)
    expect(result).toEqual(mockPost)
    expect(postService.create).toHaveBeenNthCalledWith(1, mockPost)
  })

  describe('with posts', () => {
    it('should return 404 ', async () => {
      postService.update.mockResolvedValue(null)
      expect(postController.update('_id', mockOf<PostType>())).rejects.toThrow('post not found')
    })

    it('should update a post', async () => {
      const mockPost = mockOf<PostType>({
        assetId: 'asset_id',
        category: 'test',
        content: 'test',
        title: 'test',
      })

      postService.update.mockResolvedValue(mockPost)
      const result = await postController.update(mockPost._id, mockPost)
      expect(result).toEqual(mockPost)
      expect(postService.update).toHaveBeenNthCalledWith(1, mockPost._id, mockPost)
    })

    it('should delete a post', async () => {
      const mockPost = mockOf<PostType>({
        assetId: 'asset_id',
        category: 'test',
        content: 'test',
        title: 'test',
      })

      postService.delete.mockResolvedValue(mockPost)
      await postController.delete(mockPost._id)
      expect(postService.delete).toHaveBeenNthCalledWith(1, mockPost._id)
    })
  })
})