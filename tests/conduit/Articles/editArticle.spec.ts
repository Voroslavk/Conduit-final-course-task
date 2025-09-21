import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { name } from '../userData.json'
import { APIClient } from '../../../app/APIClient'

test.describe('Edit articles', () => {
    test('EDA-001 article can be edited successfully', async ({ authorizedReq, articlesData }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.edit.editArticle({
            slug: faker.lorem.slug(3),
            title: faker.book.title(),
            description: faker.book.series(),
            body: faker.lorem.paragraph(),
            articlesDataSlug: articlesData[0].slug,
            name: name
        })

        const responseJson = await response.response.json()
        const firstArticleEdited = responseJson

        expect(response.response.status()).toBe(200)
        expect(response.firstArticle).not.toBe(firstArticleEdited)
    })

    test('EDA-002 correct status with the post method', async ({ authorizedReq, articlesData }) => {
        const payload = {
            article: {
                slug: faker.lorem.slug(3),
                title: faker.book.title(),
                description: faker.book.series(),
                body: faker.lorem.paragraph()
            }
        }

        const response = await authorizedReq.post(`/api/articles/${articlesData[0].slug}`, {
            data: payload
        })

        expect(response.status()).toBe(404)
    })
})
