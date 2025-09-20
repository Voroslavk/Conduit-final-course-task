import { APIClient } from '../../../app/APIclient'
import { test } from '../fixtures'
import { expect } from '@playwright/test'

test.describe('Search articles by tag', () => {
    test('SAT-001 list of articles is given successfully', async ({ authorizedReq, articleCreation }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.search.searchArticleByTag()

        expect(articleCreation.response.status()).toBe(200)
        expect(response.response.status()).toBe(200)

        expect(response.responseJson.articlesCount).toBeGreaterThan(0)
    })
    test('SAT-002 specific article can be found by tag', async ({ authorizedReq, articleCreation }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.search.searchArticleByTag()

        expect(articleCreation.response.status()).toBe(200)
        expect(response.response.status()).toBe(200)

        const articlesData = await articleCreation.response.json()

        const { articles } = response.responseJson
        expect(articles[0].tagList[0]).toBe('testTag')
        expect(articlesData.slug).toBe(articles.slug)
    })
})
