import { ICartProduct, SendAddress } from '../../interfaces';
import { CartState } from './';


type CartActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] } 
   | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
   | { type: '[Cart] - Change product quantity', payload: ICartProduct }
   | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
   | { type: '[Cart] - LoadAddress from Cookies', payload: SendAddress }
   | { type: '[Cart] - Update Address', payload: SendAddress }
   | { 
       type: '[Cart] - Update order summary', 
       payload: {
            numberOfItems: number,
            subTotal: number,
            discount: number,
            estimatedTime: number,
            tax: number,
            total: number
       }
    }
    | { type: '[Cart] - Order complete' }


export const cartReducer = ( state:CartState, action: CartActionType ): CartState => {

   switch (action.type) {
        case '[Cart] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [...action.payload]
            }

        case '[Cart] - Change product quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    return action.payload;
                })
            }
        
        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter( product => product._id !== action.payload._id )
            }

        case '[Cart] - Update order summary':
            return {
                ...state,
                ...action.payload
            }

        case '[Cart] - Update Address':
        case '[Cart] - LoadAddress from Cookies':
            return {
                ...state,
                sendAddress: action.payload
            }
        
        case '[Cart] - Order complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                discount: 0,
                total: 0,
            }

        default:
          return state;
   }
}