import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { APIClient } from '../../../app/APIclient'

test.describe('Add comments', () => {
    test('AC-001 new comment successfully created', async ({ authorizedReq, articlesData, articleCreation }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.create.createComment(faker.book.title(), articlesData[0].slug)

        expect(response.response.status()).toBe(200)

        const resp = await authorizedReq.get(`/api/articles/${articlesData[0].slug}/comments`)
        const respJson = await resp.json()

        expect(respJson.comments[0].body).toBe(response.newComment)
    })
})
