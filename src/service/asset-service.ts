import AssetModel, { Asset } from '../model/asset'
import { IService } from './service'

export class AssetService implements IService<Asset> {
  public async create(asset: Asset) {
    return AssetModel.create(asset)
  }

  public async update(id: string, asset: Asset) {
    return AssetModel.findOneAndUpdate({ _id: id }, asset, { new: true }).exec()
  }

  public async delete(id: string) {
    return AssetModel.findByIdAndRemove(id).exec()
  }

  public async getAll() {
    return AssetModel.find({}).exec()
  }

  public async getById(id: string) {
    return AssetModel.findById(id).exec()
  }


}
