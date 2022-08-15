import * as React from 'react';
import { FC, useEffect, useReducer } from 'react';
import { ICartProduct, IOrder, IOrderState, IPaymentMethod, SendAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookies from 'js-cookie';
import { elBuenSaborApi } from '../../api';
import axios from 'axios';
import { dbOrders } from '../../database';
import { resolve } from 'node:path/win32';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    discount: number;
    total: number;
    estimatedTime: number;
    currentState: IOrderState;
    paidMethod: IPaymentMethod;
    sendAddress?: SendAddress;
}

interface Props {
    children?: React.ReactNode | undefined,
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [],
    numberOfItems: 0,
    subTotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    estimatedTime: 0,
    currentState: 'Ingresado',
    paidMethod: 'MercadoPago',
    sendAddress: undefined,
}

export const CartProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer , CART_INITIAL_STATE );

    const getTime = async () => {
        let time = 0;
        const {data} = await elBuenSaborApi.get('/admin/orders');
        
        let validOrders = data.filter((order: { currentState: { toString: () => string; }; }) => order.currentState.toString() === 'Ingresado');
        time = validOrders.reduce((acc: any, order: { estimatedTime: any; }) => {
            return acc + order.estimatedTime;
        } , 0);
        return time;
    }

    useEffect(() => {
        try {
            const cookieProducts = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : []
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
        } catch(error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
        }
      }, [])

    useEffect(() => {

        if (Cookies.get('firstName')) {
            const sendAddress = {
                firstName: Cookies.get('firstName') || '',
                lastName: Cookies.get('lastName') || '',
                address: Cookies.get('address') || '',
                address2: Cookies.get('address2') || '',
                cp: Cookies.get('cp') || '',
                department: Cookies.get('department') || '',
                phone: Cookies.get('phone') || '',
            }
    
            dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: sendAddress })
        }   
    },[])

    useEffect(() => {
      Cookies.set('cart', JSON.stringify(state.cart));
    }, [state.cart])

    useEffect(() => {
        
        const numberOfItems = state.cart.reduce((prev, current) => current.cantidad + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => (current.cantidad * current.precio) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0.21);
        const discountRate = Number(process.env.NEXT_PUBLIC_DISCOUNT || 0.1);
        const ordersTime = 0;
        const time = 
            state.cart.reduce((prev, current) => prev + (current.estimatedTimeMinutes * current.cantidad), 0)
            + ordersTime;
        const orderSummary = {
            numberOfItems,
            subTotal,
            estimatedTime: time,
            discount: subTotal * discountRate,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });

    }, [state.cart])
    

    const addProductToCard = (product: ICartProduct) => {
        const productInCart = state.cart.some(item => item._id === product._id);
        if (!productInCart) return dispatch({ 
                                        type: '[Cart] - Update products in cart', 
                                        payload: [...state.cart, product] 
                                    })
        const updatedProducts = state.cart.map(item => {
            if (item._id !== product._id) return item;

            item.cantidad += product.cantidad;

            return item;
        });
        
        dispatch({ 
            type: '[Cart] - Update products in cart', 
            payload: updatedProducts 
        });
    }
        
    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Change product quantity', payload: product });
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product });
    }

    const updateAddress = (address: SendAddress) => {
        Cookies.set('firstName', address.firstName);
        Cookies.set('lastName', address.lastName);
        Cookies.set('address', address.address);
        Cookies.set('address2', address.address2 || '');
        Cookies.set('cp', address.cp);
        Cookies.set('department', address.department);
        Cookies.set('phone', address.phone);

        dispatch({ type: '[Cart] - Update Address', payload: address });
    }

    const createOrder = async (withDiscount: boolean): Promise<{ hasError: boolean, message: string}> => {

        if(!state.sendAddress) {
            throw new Error('No se ha definido la dirección de envío');
        }

        const body: IOrder = {
            orderItems: state.cart,
            sendAddress: state.sendAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            currentState: state.currentState,
            paidMethod: withDiscount ? 'Efectivo' : 'MercadoPago',
            estimatedTime: state.estimatedTime,
            tax: state.tax,
            discount: withDiscount ? state.subTotal * parseFloat(process.env.NEXT_PUBLIC_DISCOUNT?.toString() || '0.1') : 0,
            total: state.total - (withDiscount ? state.subTotal * parseFloat(process.env.NEXT_PUBLIC_DISCOUNT?.toString() || '0.1') : 0),
            isPaid: false,
        }

        try {
            const { data } = await elBuenSaborApi.post('/orders', body);
            
            dispatch ({ type: '[Cart] - Order complete' });

            return {
                hasError: false,
                message: data._id!
            }

        } catch (error) {
            if (axios.isAxiosError(error)){
                return {
                    hasError: true,
                    message: error.message
                }
            }
            return {
                hasError: true,
                message: 'Error no controlado. Hable con el administrador'
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,

            addProductToCard,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,
            createOrder,
            
        }}>
            { children }
        </CartContext.Provider>
    )
};