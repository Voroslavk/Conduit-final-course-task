import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { name } from '../userData.json'
import { APIClient } from '../../../app/APIclient'

test.describe('Remove article from favourites', () => {
    test('RAFF-001 article is succesfully removed from favourites', async ({ authorizedReq, articlesData, articleCreation }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.del.deleteArticleAsFavourite(articlesData[0].slug, name)

        expect(response.response.status()).toBe(200)
        expect(response.targetArticle).toBeDefined()
        expect(response.targetArticle!.favorited).toBe(false)
    })
})
