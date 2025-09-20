import { APIRequestContext } from '@playwright/test'

export class Create {
    authorizedReq: APIRequestContext
    constructor(authorizedReq: APIRequestContext) {
        this.authorizedReq = authorizedReq
    }

    async createUser(email: string, password: string, username: string) {
        const response = await this.authorizedReq.post('/api/users', {
            data: {
                user: {
                    email: email,
                    password: password,
                    username: username
                }
            }
        })
        return response
    }

    async createArticle(title: string, description: string, body: string, tagList: string[]) {
        const payload = {
            article: {
                title: title,
                description: description,
                body: body,
                tagList: tagList
            }
        }
        const response = await this.authorizedReq.post('/api/articles', {
            data: payload
        })
        return response
    }

    async createArticleWithInvalidTitleOrDescription(
        title: object | string,
        description: object | string,
        body: string,
        tagList: string[]
    ) {
        const payload = {
            article: {
                title: title,
                description: description,
                body: body,
                tagList: tagList
            }
        }
        const response = await this.authorizedReq.post('/api/articles', {
            data: payload
        })
        return response
    }

    async createComment(bodyData: string, articleDataSlug: string) {
        const response = await this.authorizedReq.post(`/api/articles/${articleDataSlug}/comments`, {
            data: {
                comment: {
                    body: bodyData
                }
            }
        })

        const responseJson = await response.json()
        const newComment = await responseJson.comment.body

        return { response, responseJson, newComment }
    }

    async createArticleAsFavourite(articlesDataSlug: string, nameData: string) {
        const response = await this.authorizedReq.post(`/api/articles/${articlesDataSlug}/favorite`)
        const responseJson = await response.json()
        const favouriteNews = await responseJson.article.slug

        const responseForFavourite = await this.authorizedReq.get(`/api/articles?offset=0&limit=5&author=${nameData}`)
        const responseForFavouriteJson = await responseForFavourite.json()

        const targetArticle = await responseForFavouriteJson.articles.find((item: any) => item.slug === favouriteNews)

        return { response, targetArticle }
    }
}
