import { APIRequestContext } from '@playwright/test'

export class Delete {
    authorizedReq: APIRequestContext
    constructor(authorizedReq: APIRequestContext) {
        this.authorizedReq = authorizedReq
    }

    async deleteArticle(articlesDataSlug: string) {
        const response = await this.authorizedReq.delete(`/api/articles/${articlesDataSlug}`)
        return response
    }

    async deleteComment(articlesDataSlug: string) {
        const requestForCommentId = await this.authorizedReq.get(`/api/articles/${articlesDataSlug}/comments`)
        const commentIt = (await requestForCommentId.json()).comments[0].id
        const response = await this.authorizedReq.delete(`/api/articles/${articlesDataSlug}/comments/${commentIt}`)

        return { response, commentIt }
    }

    async deleteArticleAsFavourite(articlesDataSlug: string, name: string) {
        const response = await this.authorizedReq.delete(`/api/articles/${articlesDataSlug}/favorite`)

        const responseJson = await response.json()
        const favouriteNews = await responseJson.article.slug

        const responseForFavourite = await this.authorizedReq.get(`/api/articles?offset=0&limit=5&author=${name}`)
        const responseForFavouriteJson = await responseForFavourite.json()

        const targetArticle = await responseForFavouriteJson.articles.find((item: any) => item.slug === favouriteNews)

        return { response, targetArticle }
    }
}
