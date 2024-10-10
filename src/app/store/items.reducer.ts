import { createReducer, on } from "@ngrx/store";
import { CartItem } from "../models/cartItem";
import { add, remove, total } from "./items.actions";

export interface ItemsState {
    items: CartItem [],
    total: number
}


export const initialState: ItemsState = {
    items: JSON.parse(sessionStorage.getItem('cart') || "[]"),
    total: 0,
}

export const itemsReducer = createReducer(

    initialState,

    on(add, (state, { product }) => {

        const hasItem = state.items.find((dataItem: CartItem) => dataItem.product.id === product.id);

        if (hasItem) {
            return { items: state.items.map( (dataItem: CartItem) => {
                if (dataItem.product.id === product.id) {       
                    return{
                            ... dataItem,
                            quantity: dataItem.quantity + 1 
                        }   
                    }
                    return dataItem;
                }),
                total: state.total
            }
        } else {
            return {
                items: [... state.items, {product: {... product}, quantity: 1}],
                total: state.total
            };
        }
    }),

    on(remove, (state, {id}) => {
        return {
            items: state.items.filter(idItem => idItem.product.id !== id),
            total: state.total
        }
    }),

    on(total, state => {
        return {
            items: state.items,
            total: state.items.reduce((acum, item) => acum + (item.quantity*item.product.price), 0)
        }
    })

)