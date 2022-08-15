import { db } from '.';
import { IProduct } from '../interfaces';
import { Product } from '../models';

interface ProductSlug {
    slug: string;
}

export const getProductBySlug =async (slug: string): Promise<IProduct | null> => {
    
    await db.connect();

    const product = await Product.findOne({ slug }).lean(); 

    await db.disconnect();

    if (!product) {
        return null;
    }

    product.imagen = product.imagen.includes('http') 
    ? product.imagen 
    : `${process.env.HOST_NAME}products/${product.imagen}`;

    return JSON.parse(JSON.stringify(product));
}

export const getAllProductsSlugs =async (): Promise<ProductSlug[]> => {
    
    await db.connect();

    const slugs = await Product.find().select('slug -_id').lean(); 

    await db.disconnect();

    return slugs;
}

export const getProductsByTerm =async (term: string): Promise<IProduct[]> => {
    
    await db.connect();

    term = term.toString().toLowerCase();

    await db.connect();

    const products: IProduct[] = await Product.find({ 
        $text: { $search: term }
    })
    .select('nombre imagen precio slug -_id')
    .lean();

    await db.disconnect();

    const updatedProducts = products.map(product => {
        product.imagen = product.imagen.includes('http') 
         ? product.imagen 
        : `${process.env.HOST_NAME}products/${product.imagen}`;

        return product;
    }); 

    return updatedProducts;
}

export const getAllProducts = async (): Promise<IProduct[]> => {
    
    await db.connect();

    const products = await Product.find().lean(); 

    await db.disconnect();

    const updatedProducts = products.map(product => {
        product.imagen = product.imagen.includes('http') 
         ? product.imagen 
        : `${process.env.HOST_NAME}products/${product.imagen}`;

        return product;
    });

    return JSON.parse(JSON.stringify(updatedProducts));
}