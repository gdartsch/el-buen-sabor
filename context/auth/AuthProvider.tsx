import * as React from 'react';
import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import { elBuenSaborApi } from '../../api';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser
}

interface Props {
    children?: React.ReactNode | undefined,
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}


export const AuthProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer , AUTH_INITIAL_STATE );
    const router = useRouter();
    const { data, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
        }
    }, [status, data])
    
    const checkToken = async () => {

        if( Cookies.get('token') === undefined ) return;

        try {
            const { data } = await elBuenSaborApi.get('/user/validate-token', { });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }


    const loginUser = async (email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await elBuenSaborApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        } catch (error) {
            return false;
        }
    }

    const registerUser = async ( name: string, email: string, password: string ): Promise<{hasError: boolean, message?: string}> => {
        try {
            const { data } = await elBuenSaborApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false,
            }
        } catch (error) {
            if( axios.isAxiosError(error) ) {
                const err = error as AxiosError
                return {
                    hasError: true,
                    message: err.message 
                }
            }

            return {
                hasError: true,
                message: 'No se pudo registrar el usuario' 
            }
        }
    }

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('cp');
        Cookies.remove('department');
        Cookies.remove('phone');
        signOut();
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            loginUser,
            registerUser,
            logout,
        }}>
            { children }
        </AuthContext.Provider>
    )
};