import Joi from '@hapi/joi'

const postSchema = {
  assetId: Joi.string().hex().length(24),
  category: Joi.string().required(),
  content: Joi.string().required(),
  title: Joi.string().required(),

}

export default {
  create: {
    body: {
      ...postSchema,
    },
  },
  delete: {
    params: {
      id: Joi.string().hex().length(24),
    },
  },
  getAll: {
    query: {
      category: Joi.string().optional(),
      sort: Joi.string().valid('asc', 'desc').optional(),
    },
  },
  getById: {
    params: {
      id: Joi.string().hex().length(24),
    },
  },
  update: {
    body: {
      ...postSchema,
    },
    params: {
      id: Joi.string().hex().length(24),
    },
  },
}
