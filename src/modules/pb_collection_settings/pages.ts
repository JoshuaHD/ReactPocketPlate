import {default as notes} from  '@/modules/notes/setup.js'
import { Pages } from './types.js'

const pages: Pages = {
    notes: {
        collection: notes.collection,
        queryOptions: notes.queryOptions,
        listEntriesProps: notes.listEntriesProps,
        formCreateSchema: notes.formCreateSchema,
        formCreateMetadata: notes.formCreateMetadata,
        formUpdateSchema: notes.formUpdateSchema,
        formUpdateMetadata: notes.formUpdateMetadata,
    }
}
  
export default pages