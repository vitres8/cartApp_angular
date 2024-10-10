import { createReducer, on } from "@ngrx/store"
import { load } from "./products.actions"


const products: any[] = [];

const initialstate = {
    products
}

export const productsReducer = createReducer(
    initialstate,
    on(load, (state, {products}) => ({ products: [... products] })),
    
)