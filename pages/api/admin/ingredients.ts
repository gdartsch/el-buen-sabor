import { AdbSharp } from '@mui/icons-material'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IIngredient, IProduct } from '../../../interfaces';
import { Ingredient, Product } from '../../../models';
import { isValidObjectId } from 'mongoose';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data = 
|{ message: string }
| IIngredient[]
| IIngredient

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method) {
        case 'GET':
            return getIngredients(req, res);
        
        case 'POST':
            return createIngredient(req, res);

        case 'PUT':
            return updateIngredient(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' })
    
    }
}

const getIngredients = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        
    await db.connect
    const ingredients = await Ingredient.find()
        .sort({ title: 'asc'})
        .lean();

    await db.disconnect();

    res.status(200).json(ingredients);

}
const updateIngredient = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const {_id = ''} = req.body as IIngredient;

    if (!isValidObjectId(_id)){
        return res.status(400).json({ message: 'Id no válido' });
    }

    try {
        await db.connect();
        const ingredient = await Ingredient.findById(_id);
        if(!ingredient){
            await db.disconnect();
            return res.status(400).json({ message: 'Ingrediente no encontrado' });
        }
            
        await ingredient.update( req.body );

        await db.disconnect();

        res.status(200).json( ingredient );

    } catch (error) {

        console.log(error);
        await db.disconnect();
        res.status(400).json({ message: 'Error al actualizar ingrediente' });

    }

}

const createIngredient = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        await db.connect();

        const ingredientInDb = await Ingredient.findOne({ slug: req.body.slug });

        if(ingredientInDb){
            await db.disconnect();
            return res.status(400).json({ message: 'Ingrediente ya existe' });
        }

        const ingredient = new Ingredient(req.body);

        await ingredient.save();

        await db.disconnect();

        res.status(201).json( ingredient );

    } catch (error) {

        console.log(error);
        await db.disconnect();
        res.status(400).json({ message: 'Error al actualizar ingrediente' });

    }

}