import { createReducer, on } from "@ngrx/store"
import { findAll, load } from "./products.actions"


const products: any[] = [];

const initialstate = {
    products
}

export const productsReducer = createReducer(
    
    initialstate,
    on(load, (state) => ({ products: [...state.products] })),
    on(findAll, (state, {products}) => ({ products: [... products] })),

)