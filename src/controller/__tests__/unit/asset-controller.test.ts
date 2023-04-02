import { AssetController } from "../../asset-controller"
import { AssetType } from "../../../model/asset"
import { AssetService } from "../../../service/asset-service"
import { mockOf } from "../../../__tests__/mockOf"

describe('Integration - AssetService', () => {
  const assetService = mockOf<AssetService>()
  const assetController = new AssetController(assetService)

  describe('GET', () => {
    it('should return 404', async () => {
      assetService.getById.mockResolvedValue(null)
      const unknownId = '1'
      expect(assetController.get(unknownId)).rejects.toThrow('asset not found')
    })

    it('should get asset by id', async () => {
      const mockAsset = { _id: '1', contentType: 'pdf', fileName: 'test', fileSize: 200 }
      const asset = mockOf<AssetType>(mockAsset)

      assetService.getById.mockResolvedValue(asset)
      const result = await assetController.get(asset._id)
      expect(result).toEqual(mockAsset)
      expect(assetService.getById).toHaveBeenNthCalledWith(1, mockAsset._id)
    })
  })

  describe('POST', () => {
    it('should create an asset', async () => {
      const mockFile = {
        mimetype: 'pdf',
        filename: 'test',
        size: 200
      }
      const mockAsset = {
        _id: '1',
        contentType: mockFile.mimetype,
        fileName: mockFile.filename,
        fileSize: mockFile.size,
      }

      assetService.create.mockResolvedValue(mockOf<AssetType>(mockAsset))
      const result = await assetController.create(mockOf<Express.Multer.File>(mockFile))
      expect(result).toEqual(mockAsset)
      expect(assetService.create).toHaveBeenNthCalledWith(1, {
        contentType: mockFile.mimetype,
        fileName: mockFile.filename,
        fileSize: mockFile.size,
      })
    })
  })
})