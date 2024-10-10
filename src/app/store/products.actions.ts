import { createAction, props } from "@ngrx/store";
import { Product } from "../models/product";

export const load = createAction('load', props<{products: any}>())