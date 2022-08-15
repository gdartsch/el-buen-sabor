import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data = 
| { message: string }
| { 
    token: string;
    user: {
        name: string;
        email: string;
        role: string;
    }
 }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email='', password='', name=''} = req.body as { email: string, password: string, name: string };
 
    if(password.length < 6) {
        return res.status(400).json({ 
            message: 'La contraseña debe tener al menos 6 caracteres' 
        })
    }
    
    if(password.length < 2) {
        return res.status(400).json({ 
            message: 'El nombre debe tener al menos 2 caracteres' 
        })
    }

    if(!validations.isValidEmail(email)) {
        return res.status(400).json({
            message: 'El email no parece ser válido'
        })
    }
    
    await db.connect();
    const user = await User.findOne({ email }); 

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'User',
        name,
    });

    if (user) {
        return res.status(400).json({ message: 'Ese correo ya está registrado' })
    }

    try {
        await newUser.save({validateBeforeSave: true});
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el usuario' })
    }

    const {_id, role } = newUser;

    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token,
        user: {
            email, role, name
        }
     })
}