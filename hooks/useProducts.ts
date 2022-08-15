import useSWR, { SWRConfiguration } from 'swr';
import { elBuenSaborApi } from '../api';
import { IProduct } from '../interfaces';
import { IIngredient } from '../interfaces/ingredient';


const fetcher = (...args:[key:string]) => fetch(...args).then(res => res.json());


export const useProducts = (url: string, config: SWRConfiguration = {}) => {

    const { data, error } = useSWR<IProduct[]>(`/api${url}`, config );
    
    return {
        products: data || [],
        isLoading: !error && !data,
        isError: error
    };
}

export const useIngredients = (url: string, config: SWRConfiguration = {}) => {
    
    const { data, error } = useSWR<IIngredient[]>(`/api${url}`, config );
    
    return {
        ingredient: data || [],
        isLoading: !error && !data,
        isError: error
    };
}