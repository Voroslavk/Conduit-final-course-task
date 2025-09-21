import { APIClient } from '../../../app/APIClient'
import { test } from '../fixtures'
import { expect } from '@playwright/test'

test.describe('Delete comments', () => {
    test('DC-001 comment was successfully deleted', async ({ authorizedReq, articlesData, commentCreation }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.del.deleteComment(articlesData[0].slug)

        expect(response.response.status()).toBe(204)

        const resp = await authorizedReq.get(`/api/articles/${articlesData[0].slug}/comments`)
        const respJson = await resp.json()

        if (respJson.comments.length > 0) {
            expect(respJson.comments[0].id).not.toBe(response.commentIt)
        } else {
            expect(respJson.comments.length).toBe(0)
        }
    })
})
