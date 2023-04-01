import Joi from '@hapi/joi'
import { Request, Response } from 'express'
import 'reflect-metadata'
import { Errors } from 'typescript-rest'

export interface JoiModelObject {
  [key: string]: Joi.Schema
}

export interface ValidateModel {
  body?: Joi.ObjectSchema<JoiModelObject> | JoiModelObject
  query?: Joi.ObjectSchema<JoiModelObject> | JoiModelObject
  params?: Joi.ObjectSchema<JoiModelObject> | JoiModelObject
}

export default function validate(model: ValidateModel) {
  let querySchema: Joi.ObjectSchema<unknown> | undefined
  let bodySchema: Joi.ObjectSchema<unknown> | undefined
  let paramsSchema: Joi.ObjectSchema<unknown> | undefined

  const setSchema = (obj: Joi.ObjectSchema<JoiModelObject> | JoiModelObject) =>
    Joi.isSchema(obj)
      ? (obj as Joi.ObjectSchema<unknown>)
      : Joi.object(obj as JoiModelObject)

  if (model.query) {
    querySchema = setSchema(model.query)
  }

  if (model.body) {
    bodySchema = setSchema(model.body)
  }

  if (model.params) {
    paramsSchema = setSchema(model.params)
  }

  if (!querySchema && !bodySchema && !paramsSchema) {
    throw Error('Query, Body or Params schema required')
  }

  return function (req: Request, _?: Response): void {
    if (querySchema) {
      const queryResult = querySchema.validate(req.query)
      if (queryResult.error) {
        throw new Errors.BadRequestError(queryResult.error.message)
      }
    }

    if (bodySchema) {
      const bodyResult = bodySchema.validate(req.body)
      if (bodyResult.error) {
        throw new Errors.BadRequestError(bodyResult.error.message)
      }
    }

    if (paramsSchema) {
      const paramsResult = paramsSchema.validate(req.params)
      if (paramsResult.error) {
        throw new Errors.BadRequestError(paramsResult.error.message)
      }
    }
  }
}

const schema = Joi.object.bind(Joi)

export { validate, schema }
