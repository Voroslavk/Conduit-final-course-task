import { APIRequestContext } from '@playwright/test'
import { Create } from './controllers/create/Create.controller'
import { Delete } from './controllers/delete/Delete.controller'
import { Edit } from './controllers/edit/Edit.controller'
import { Search } from './controllers/search/Search.controller'

export class APIClient {
    create: Create
    del: Delete
    edit: Edit
    search: Search

    constructor(authorizedReq: APIRequestContext) {
        this.create = new Create(authorizedReq)
        this.del = new Delete(authorizedReq)
        this.edit = new Edit(authorizedReq)
        this.search = new Search(authorizedReq)
    }
}
