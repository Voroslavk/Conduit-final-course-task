import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { APIClient } from '../../../app/APIClient'

test.describe('Search by tag', () => {
    test('SBT-001 article is succesfully found by tag', async ({ authorizedReq, articleCreation }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.search.searchByTag(articleCreation.payload.article.tagList)

        expect(response.status()).toBe(200)
        expect((await response.json()).articlesCount).toBeGreaterThan(0)
    })
})
