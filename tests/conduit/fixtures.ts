import { APIRequestContext, APIResponse, test as base, request } from '@playwright/test'
import { name } from './userData.json'
import * as dotenv from 'dotenv'
import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'

interface Author {
    username: string
    bio: string | null
    image: string
    following: boolean
}

interface ArticleData {
    slug: string
    title: string
    description: string
    body: string
    createdAt: string
    updatedAt: string
    tagList: string[]
    favorited: boolean
    favoritesCount: number
    author: Author
}

interface Article {
    article: {
        title: string
        description: string
        body: string
        tagList: string[]
    }
}

interface ArticlesResponse {
    articles: ArticleData[]
    articlesCount: number
}

type Fixtures = {
    authorizedReq: APIRequestContext
    articlesData: ArticleData[]
    articleCreation: {
        payload: Article
        response: APIResponse
    }
    commentCreation: {
        response: APIResponse
        responseJson: JSON
        newComment: string
    }
    personData: {
        token: string
        name: string
        email: string
        password: string
    }
}

export const test = base.extend<Fixtures>({
    personData: async ({ authorizedReq }, use) => {
        const pass = faker.internet.password({ length: 5 })
        const response: APIResponse = await authorizedReq.post('/api/users', {
            data: {
                user: {
                    email: faker.internet.email({ firstName: 'lefansky', provider: 'gmail.com', allowSpecialCharacters: false }),
                    password: pass,
                    username: faker.lorem.word({ length: { min: 5, max: 8 }, strategy: 'any-length' })
                }
            }
        })

        const resultJson = await response.json()
        let name = await resultJson.user.username
        let email = await resultJson.user.email
        let token = await resultJson.user.token
        let password = pass
        console.log(`Token obtained`)

        const userData = { name, email, password }
        fs.writeFileSync('./tests/conduit/userData.json', JSON.stringify(userData, null, 2))
        console.log(`userData file created`)

        const tokenData = `TOKEN=${token}\n`
        fs.writeFileSync(path.resolve(__dirname, '../../.env'), tokenData, { flag: 'w' })
        console.log(`.env file updated with new token`)

        await use({ token, name, email, password })
    },

    authorizedReq: async ({}, use) => {
        dotenv.config()
        const token = process.env.TOKEN
        const authorized = await request.newContext({
            extraHTTPHeaders: {
                authorization: `Token ${token}`
            }
        })

        await use(authorized)
        await authorized.dispose()
    },

    articleCreation: async ({ authorizedReq }, use) => {
        const payload = {
            article: {
                title: faker.lorem.words(3),
                description: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(1),
                tagList: [faker.word.noun()]
            }
        }
        const response = await authorizedReq.post('/api/articles', {
            data: payload
        })

        await use({ payload, response })
    },

    articlesData: async ({ authorizedReq }, use) => {
        const response = await authorizedReq.get(`/api/articles?offset=0&limit=5&author=${name}`)
        const data: ArticlesResponse = await response.json()

        const articles: ArticleData[] = data.articles.map(a => ({
            slug: a.slug,
            title: a.title,
            description: a.description,
            body: a.body,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            tagList: a.tagList,
            favorited: a.favorited,
            favoritesCount: a.favoritesCount,
            author: {
                username: a.author.username,
                bio: a.author.bio,
                image: a.author.image,
                following: a.author.following
            }
        }))

        await use(articles)
    },

    commentCreation: async ({ authorizedReq, articlesData }, use) => {
        const response = await authorizedReq.post(`/api/articles/${articlesData[0].slug}/comments`, {
            data: {
                comment: {
                    body: faker.book.title()
                }
            }
        })

        const responseJson = await response.json()
        const newComment = await responseJson.comment.body

        await use({ response, responseJson, newComment })
    }
})
