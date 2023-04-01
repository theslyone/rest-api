import { Inject } from 'typescript-ioc'
import { Errors, FileParam, GET, Path, PathParam, POST, PreProcessor } from 'typescript-rest'
import { Asset } from '../model/asset'
import { AssetService } from '../service/asset-service'
import assetSchema from '../validation/asset'
import { validate } from '../validation/validate'

@Path('/assets')
export class AssetController {
    constructor(@Inject private assetService: AssetService) { }

    @POST
    public create(@FileParam('asset') file: Express.Multer.File): Promise<Asset> {
        const asset: Asset = {
            contentType: file.mimetype,
            fileName: file.filename,
            fileSize: file.size,
        }

        return this.assetService.create(asset)
    }

    /**
     * Returns an Asset
     * @param id Asset identity
     * @return an Asset
     */
    @GET
    @Path(':id')
    @PreProcessor(validate(assetSchema.get))
    public async get(@PathParam('id') id: string): Promise<Asset> {
        const asset = await this.assetService.getById(id)
        if (!asset) {
            throw new Errors.NotFoundError(`asset not found`)
        }

        return asset
    }
}
