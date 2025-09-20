import { APIClient } from '../../../app/APIclient'
import { test } from '../fixtures'
import { expect } from '@playwright/test'

test.describe.serial('Delete articles', () => {
    test('DA-001 article deletes successfully', async ({ authorizedReq, articlesData, articleCreation }) => {
        const firstArticleSlug = articlesData[0].slug
        const client = new APIClient(authorizedReq)
        const response = await client.del.deleteArticle(articlesData[0].slug)

        expect(response.status()).toBe(204)

        const responseCheck = await authorizedReq.get('/api/articles?offset=0&limit=10')
        const responseCheckJson = await responseCheck.json()

        expect(responseCheckJson.articles[0].slug).not.toBe(firstArticleSlug)
    })

    test('DA-002 the system gets correct status code after deletion of unexisting article slug', async ({
        authorizedReq,
        articlesData
    }) => {
        // const secondArticleSlug = articlesData[1].slug
        const fakeSlug = 'abra-cadabra-test123'
        const client = new APIClient(authorizedReq)
        const response = await client.del.deleteArticle(fakeSlug)

        expect(response.status()).toBe(404)

        // const responseCheck = await authorizedReq.get('/api/articles?offset=0&limit=10')
        // const responseCheckJson = await responseCheck.json()

        // expect(responseCheckJson.articles[1].slug).toBe(secondArticleSlug)
    })
})
