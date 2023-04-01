'use strict'

import chai from 'chai'
import { before, beforeEach, describe, it } from 'mocha'
import supertest from 'supertest'
import { HttpMethod, Server } from 'typescript-rest'
import { ApiServer } from '../src/api-server'

const expect = chai.expect

const apiServer = new ApiServer()
const server = supertest.agent(`http://localhost:${apiServer.PORT}`)

describe('Route Tests', () => {
    describe('rest server', () => {
        it('should provide a catalog containing all exposed endpoints', () => {
            expect(Server.getPaths()).to.include.members([
                '/assets',
                '/assets/:id',
                '/posts',
                '/posts/:id',
            ])
            expect(Server.getHttpMethods('/assets')).to.have.members([
                HttpMethod.POST,
            ])
            expect(Server.getHttpMethods('/assets/:id')).to.have.members([
                HttpMethod.GET,
            ])
            expect(Server.getHttpMethods('/posts')).to.have.members([
                HttpMethod.GET,
                HttpMethod.POST,
            ])
            expect(Server.getHttpMethods('/posts/:id')).to.have.members([
                HttpMethod.GET,
                HttpMethod.PUT,
                HttpMethod.DELETE,
            ])
        })
    })

    describe('/assets', () => {
        it('should fail if uuid is invalid', async () => {
            await server
                .get('/assets/__invalid__uuid')
                .expect(400)
                .then(({ body }) => {
                    expect(body).to.deep.equal({
                        message: '"id" must only contain hexadecimal characters',
                    })
                })
        })

        it('should return not found', async () => {
            await server
                .get('/assets/6427c4114450d70012b6a4b2')
                .expect(404)
                .then(({ body }) => {
                    expect(body).to.deep.equal({ message: 'asset not found' })
                })
        })

        it('should save an asset', async () => {
            await server
                .post('/assets')
                .attach('asset', './test/mocha.opts')
                .expect(200)
        })
    })

    describe('/posts', () => {
        it('should fail if uuid is invalid', async () => {
            await server
                .get('/posts/__invalid__uuid')
                .expect(400)
                .then(({ body }) => {
                    expect(body).to.deep.equal({
                        message: '"id" must only contain hexadecimal characters',
                    })
                })
        })

        it('should return not found', async () => {
            await server
                .get('/posts/6427c4114450d70012b6a4b1')
                .expect(404)
                .then(({ body }) => {
                    expect(body).to.deep.equal({ message: 'post not found' })
                })
        })

        it('should save a post', async () => {
            const { body: asset } = await server
                .post('/assets')
                .attach('asset', './test/mocha.opts')
            await server
                .post('/posts')
                .send({
                    assetId: asset._id,
                    category: 'test',
                    content: 'test',
                    title: 'test',
                })
                .expect(200)
        })

        describe('with post', () => {
            let post: any
            beforeEach(async () => {
                const { body: asset } = await server
                    .post('/assets')
                    .attach('asset', './test/mocha.opts')
                const { body } = await server
                    .post('/posts')
                    .send({
                        assetId: asset._id,
                        category: 'test',
                        content: 'test',
                        title: 'test',
                    })
                post = body
            })

            it('should get post by id', async () => {
                await server
                    .get(`/posts/${post._id}`)
                    .expect(200)
            })

            it('should update a post', async () => {
                await server
                    .put(`/posts/${post._id}`)
                    .send({
                        assetId: post.assetId,
                        category: 'test 2',
                        content: 'test 2',
                        title: 'test',
                    })
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.category).to.deep.equal('test 2')
                        expect(body.content).to.deep.equal('test 2')
                    })
            })

            it('should delete a post', async () => {
                await server
                    .delete(`/posts/${post._id}`)
                    .expect(204)
            })
        })


        describe('with several posts', async () => {
            before(async () => {
                const { body: asset } = await server
                    .post('/assets')
                    .attach('asset', './test/mocha.opts')

                for (let idx = 0; idx <= 5; idx++) {
                    await server
                        .post('/posts')
                        .send({
                            assetId: asset._id,
                            category: `test ${idx}`,
                            content: `test ${idx}`,
                            title: `test ${idx}`,
                        })
                }
            })

            it('should get all posts', async () => {
                await server
                    .get('/posts')
                    .expect(200).then(({ body }) => {
                        expect(body.length).to.be.gte(5)
                    })
            })
        })
    })
})
