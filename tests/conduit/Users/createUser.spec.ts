import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { APIClient } from '../../../app/APIclient'

let email = faker.internet.email({ firstName: 'lefansky', provider: 'gmail.com', allowSpecialCharacters: false })
let password = faker.internet.password({ length: 5 })
let username = faker.person.firstName()

type Errors = { username?: string; email?: string; message?: string }

const negativeTestData = [
    {
        testTitle: 'UC-002 get an error when used an undefined credentials for sign up',
        userData: {
            user: {
                email: undefined,
                password: undefined,
                username: undefined
            }
        },
        statusCode: 500,
        errorMessage: 'Pass phrase must be a buffer',
        errorField: 'message'
    },
    {
        testTitle: 'UC-003 correct status code received when wrong username was used',
        userData: {
            user: {
                email: email,
                password: password,
                username: faker.internet.username({ firstName: 'lefansky_' })
            }
        },
        statusCode: 422,
        errorMessage: 'is invalid',
        errorField: 'username'
    },
    {
        testTitle: 'UC-004 correct status code received when wrong email was used',
        userData: {
            user: {
                email: faker.internet.email({ firstName: 'lefansky', provider: 'faker', allowSpecialCharacters: true }),
                password: password,
                username: username
            }
        },
        statusCode: 422,
        errorMessage: 'is invalid',
        errorField: 'email'
    }
]

test.describe('User creation', () => {
    test('UC-001 user successfully created', async ({ authorizedReq }) => {
        const client = new APIClient(authorizedReq)
        const response = await client.create.createUser(email, password, username)

        const resultJson = await response.json()

        expect(response.status()).toBe(200)
        expect(response.headers()['connection']).toBe('keep-alive')
        expect(resultJson.user.token).toBeDefined()
    })

    for (const { testTitle, userData, statusCode, errorMessage, errorField } of negativeTestData) {
        test(`${testTitle}`, async ({ authorizedReq }) => {
            const response = await authorizedReq.post('/api/users', {
                data: {
                    user: {
                        email: userData.user.email,
                        password: userData.user.password,
                        username: userData.user.username
                    }
                }
            })

            const resultJson = await response.json()

            expect(response.status()).toBe(statusCode)
            expect((resultJson.errors as Errors)[errorField]).toBe(errorMessage)
        })
    }
})
