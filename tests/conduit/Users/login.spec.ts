import { test } from '../fixtures'
import { expect } from '@playwright/test'
import { email, password } from '../userData.json'

test.describe('User login', () => {
    test('UL-001 login is successfull', async ({ request, personData }) => {
        const response = await request.post('/api/users/login', {
            data: {
                user: {
                    email: personData.email,
                    password: personData.password
                }
            }
        })
        const respJson = await response.json()
        const token = await respJson.user.token

        expect(response.status()).toBe(200)
        expect(token).toBeDefined()
    })
    test('UL-002 login with incorrect email', async ({ request }) => {
        const response = await request.post('/api/users/login', {
            data: {
                user: {
                    email: 'failed' + email,
                    password: password
                }
            }
        })
        const respJson = await response.json()
        console.log(respJson)

        expect(response.status()).toBe(422)
        expect(respJson.errors['email or password']).toBe('is invalid')
    })
    test('UL-003 login with incorrect password', async ({ request }) => {
        const response = await request.post('/api/users/login', {
            data: {
                user: {
                    email: email,
                    password: 'failed' + password
                }
            }
        })
        const respJson = await response.json()

        expect(response.status()).toBe(422)
        expect(respJson.errors['email or password']).toBe('is invalid')
    })
})
