import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { APIClient } from '../../../app/APIclient'

test.describe('Search article', () => {
    test('SA-001 article can be found by slug', async ({ authorizedReq, articlesData }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.search.searchArticle(articlesData[0].slug)

        expect(response.response.status()).toBe(200)
        expect(response.article.slug).toBe(articlesData[0].slug)
    })
    test('SA-002 get article slug which never exist', async ({ authorizedReq }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.search.searchArticle(faker.person.firstName())

        expect(response.response.status()).toBe(404)
    })
})
