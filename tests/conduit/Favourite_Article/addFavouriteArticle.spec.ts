import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { name } from '../userData.json'
import { APIClient } from '../../../app/APIclient'

test.describe('Add article to favourites', () => {
    test('AATF-001 article is succesfully added to the favourites', async ({ authorizedReq, articlesData }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.create.createArticleAsFavourite(articlesData[0].slug, name)

        expect(response.response.status()).toBe(200)
        expect(response.targetArticle).toBeDefined()
        expect(response.targetArticle!.favorited).toBe(true)
    })
})
