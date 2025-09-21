import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { APIClient } from '../../../app/APIClient'

test.describe.serial('Edit user data', () => {
    let name: string
    let email: string
    let token: string

    test.beforeAll(async ({ request }) => {
        const response = await request.post('/api/users', {
            data: {
                user: {
                    email: faker.internet.email({ firstName: 'lefansky', provider: 'gmail.com', allowSpecialCharacters: false }),
                    password: faker.internet.password({ length: 5 }),
                    username: faker.lorem.word({ length: { min: 4, max: 9 }, strategy: 'any-length' })
                }
            }
        })

        const resultJson = await response.json()
        name = await resultJson.user.username
        email = await resultJson.user.email
        token = await resultJson.user.token
    })

    test('EU-001 user name can be changed', async ({ request }) => {
        const client = new APIClient(request)
        const response = await client.edit.editUser({ username: faker.person.firstName(), token: `${token}` })

        const responseJson = await response.json()

        expect(response.status()).toBe(200)
        expect(responseJson.user.username).not.toBe(name)
    })

    test('EU-002 user email can be changed', async ({ request }) => {
        const client = new APIClient(request)
        const response = await client.edit.editUser({
            email: faker.internet.email({ firstName: 'lefansky', provider: 'gmail.com', allowSpecialCharacters: false }),
            token: `${token}`
        })

        const responseJson = await response.json()

        expect(response.status()).toBe(200)
        expect(responseJson.user.email).not.toBe(email)
    })

    test('EU-003 user password can be changed', async ({ request }) => {
        const client = new APIClient(request)
        const response = await client.edit.editUser({
            password: faker.internet.password({ length: 5 }),
            token: `${token}`
        })

        expect(response.status()).toBe(200)
    })
})
