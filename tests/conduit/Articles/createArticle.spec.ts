import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import Joi from 'joi'
import { APIClient } from '../../../app/APIClient'

test.describe('Create article', () => {
    test('CA-001 article creation is successful', async ({ authorizedReq }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.create.createArticle(faker.lorem.words(3), faker.lorem.sentence(), faker.lorem.paragraphs(1), [
            faker.word.noun()
        ])

        expect(response.status()).toBe(200)
        expect(response.headers()['content-type']).toBe('application/json; charset=utf-8')
    })

    test('CA-002 impossible to create article with invalid title', async ({ authorizedReq }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.create.createArticleWithInvalidTitleOrDescription(
            {},
            faker.lorem.sentence(),
            faker.lorem.paragraphs(1),
            []
        )

        const responseJson = await response.json()

        expect(response.status()).toBe(500)
        expect(responseJson.errors.message).toBe("Cannot read property 'toString' of undefined")
    })

    test('CA-003 impossible to create article with description equal to object', async ({ authorizedReq }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.create.createArticleWithInvalidTitleOrDescription(
            faker.lorem.words(3),
            {},
            faker.lorem.paragraphs(1),
            []
        )

        const responseJson = await response.json()

        expect(response.status()).toBe(422)
        expect(responseJson.errors.description).toBe('Cast to String failed for value "[object Object]" at path "description"')
    })

    test('CA-004 Joi schema validation for created article', async ({ authorizedReq }) => {
        const articlePayload = {
            article: {
                title: faker.lorem.words(3),
                description: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(1),
                tagList: []
            }
        }

        const response = await authorizedReq.post('/api/articles', { data: articlePayload })
        const json = await response.json()

        const schema = Joi.object({
            article: Joi.object({
                slug: Joi.string().required(),
                title: Joi.string().required(),
                description: Joi.string().required(),
                body: Joi.string().required(),
                createdAt: Joi.date().iso().required(),
                updatedAt: Joi.date().iso().required(),
                tagList: Joi.array().items(Joi.string()).required(),
                favorited: Joi.boolean().required(),
                favoritesCount: Joi.number().integer().required(),
                author: Joi.object({
                    username: Joi.string().required(),
                    image: Joi.string().uri().required(),
                    following: Joi.boolean().required()
                }).required()
            }).required()
        }).required()

        expect(response.status()).toBe(200)
        const { error } = schema.validate(json, { abortEarly: false })
        expect(error).toBeUndefined()
    })
})
