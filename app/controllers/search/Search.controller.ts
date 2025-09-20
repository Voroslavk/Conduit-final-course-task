import { APIRequestContext } from '@playwright/test'

export class Search {
    authorizedReq: APIRequestContext
    constructor(authorizedReq: APIRequestContext) {
        this.authorizedReq = authorizedReq
    }

    async searchArticle(articleDataSlug: string) {
        const response = await this.authorizedReq.get(`/api/articles/${articleDataSlug}`)

        try {
            const { article } = await response.json()
            return { response, article }
        } catch {
            return { response }
        }
    }
    async searchArticleByTag() {
        const response = await this.authorizedReq.get(`/api/articles?offset=0&limit=10&tag=testTag`)
        const responseJson = await response.json()

        return { response, responseJson }
    }
    async searchByTag(articleCreationPayload) {
        const response = await this.authorizedReq.get(`/api/articles?offset=0&limit=10&tag=${articleCreationPayload}`)
        return response
    }
}
