import { createContext, VoidFunctionComponent } from "react"
import { ICartProduct, SendAddress } from "../../interfaces";

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    discount: number;
    total: number;
    estimatedTime: number;

    sendAddress?: SendAddress;

    addProductToCard: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (sendAddress: SendAddress) => void;
    createOrder: (withContext: boolean) => Promise<{ hasError: boolean, message: string}>
}


export const CartContext = createContext({} as ContextProps);