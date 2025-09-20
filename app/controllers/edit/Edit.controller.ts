import { APIRequestContext } from '@playwright/test'

export class Edit {
    authorizedReq: APIRequestContext
    constructor(authorizedReq: APIRequestContext) {
        this.authorizedReq = authorizedReq
    }

    async editArticle({
        slug,
        title,
        description,
        body,
        articlesDataSlug,
        name
    }: {
        slug: string
        title: string
        description: string
        body: string
        articlesDataSlug: string
        name: string
    }) {
        const responseGetArticles = await this.authorizedReq.get(`/api/articles?offset=0&limit=10&author=${name}`)
        const responseGetArticlesJson = await responseGetArticles.json()
        const firstArticle = responseGetArticlesJson

        const response = await this.authorizedReq.put(`/api/articles/${articlesDataSlug}`, {
            data: {
                article: {
                    slug: slug,
                    title: title,
                    description: description,
                    body: body
                }
            }
        })

        return { response, firstArticle }
    }
    async editUser({ username, email, password, token }: { username?: string; email?: string; password?: string; token?: string }) {
        const response = await this.authorizedReq.put('/api/user', {
            data: {
                user: {
                    username: username,
                    email: email,
                    password: password
                }
            },
            headers: {
                authorization: `Token ${token}`
            }
        })

        return response
    }
}
