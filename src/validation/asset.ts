import Joi from '@hapi/joi'

export default {
  get: {
    params: {
      id: Joi.string().hex().length(24)
    },
  },
}
