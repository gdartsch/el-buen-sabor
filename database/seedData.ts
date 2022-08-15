import bcrypt from 'bcryptjs';

interface SeedProduct {
    nombre: string;
    categoria: ValidCategories;
    imagen: string;
    precio: number;
    descripcion: string;
    estimatedTimeMinutes: number;
    recipe: [string, number][];
    slug: string;
    active: boolean;
}


interface SeedUser {
    name: string;
    email: string;
    password: string;
    role: 'Admin'|'User'|'Chef'|'Delivery'|'Cashier';
}

interface SeedIngredient {
    nombre: string;
    unidadMedida: ValidUnits;
    categoria: ValidIngredientCategories;
    costoUnidad: number;
    inStock: number;
    minStock: number;
    slug: string;
    active: boolean;
}

interface SeedIngredientItem {
    ingrediente: string;
    cantidad: number;
}


type ValidUnits = 'Kg'|'Lt'|'Gr'|'Unidad'|'Otro';
type ValidIngredientCategories = 'bebida'|'lacteos'|'carne'|'panificados'|'vegetales'|'condimentos'|'otro';
type ValidCategories = 'bebida'|'hamburguesa'|'pizza'|'pancho'|'guarnicion'|'lomo'|'otro';

interface SeedData {
    users: SeedUser[];
    products: SeedProduct[],
    ingredients: SeedIngredient[];
}




export const initialData: SeedData = {
    ingredients: [
        {
            nombre: 'Aceite de Oliva',
            unidadMedida: 'Lt',
            categoria: 'bebida',
            costoUnidad: 0.5,
            inStock: 100,
            minStock: 10,
            slug: 'aceite-de-oliva',
            active: true,
        },
        {
            nombre: 'Queso',
            unidadMedida: 'Gr',
            categoria: 'lacteos',
            costoUnidad: 0.5,
            inStock: 100,
            minStock: 10,
            slug: 'queso',
            active: true,
        },
        {
            nombre: 'Tomate',
            unidadMedida: 'Gr',
            categoria: 'vegetales',
            costoUnidad: 0.5,
            inStock: 100,
            minStock: 10,
            slug: 'tomate',
            active: true,
        },
        {
            nombre: 'Cebolla',
            unidadMedida: 'Gr',
            categoria: 'vegetales',
            costoUnidad: 0.5,
            inStock: 100,
            minStock: 10,
            slug: 'cebolla',
            active: true,
        },
    ],
    users: [
        {
            name: 'Juan Carlos BuenSabor',
            email: 'juanbuensabor@gmail.com',
            password: bcrypt.hashSync('123456'),
            role: 'Admin'
        },
        {
            name: 'Alberto Gimenez',
            email: 'albertobuensabor@gmail.com',
            password: bcrypt.hashSync('123456'),
            role: 'User'
        },
    ],
    products: [
        {
            nombre: "Tarta de queso y vegetales",
            categoria: 'otro',
            imagen: 'nro1.jpeg',
            precio: 450,
            descripcion: "Tarta de vegetales sabor mediterráneo, apto para veganos",
            estimatedTimeMinutes: 15,
            recipe: [
                ['Queso', 2],
                ['Tomate', 1],
                ['Cebolla', 1],
            ],
            slug: "tarta_vegetales_mediterraneo1",
            active: true,
        },
        {
            nombre: "Pizza margarita",
            categoria: 'pizza',
            imagen: 'nro2.jpeg',
            precio: 450,
            descripcion: "El clásico de queso y carne molida",
            estimatedTimeMinutes: 15,
            recipe: [
                ['Queso', 2],
                ['Tomate', 1],
                ['Cebolla', 1],
            ],
            slug: "pizza_margarita1",
            active: true,
        },
        {
            nombre: "Hamburguesa de queso",
            categoria: 'hamburguesa',
            imagen: 'nro3.jpeg',
            precio: 450,
            descripcion: "RRRRica hamburguesa de queso",
            estimatedTimeMinutes: 15,
            recipe: [
                ['Queso', 2],
                ['Tomate', 1],
                ['Cebolla', 1],
            ],
            slug: "hamburguesa_queso1",
            active: true,
        },
        {
            nombre: "Pancho",
            categoria: 'pancho',
            imagen: 'nro4.jpeg',
            precio: 450,
            descripcion: "La comida de la verguenza",
            estimatedTimeMinutes: 15,
            recipe: [
                ['Queso', 2],
                ['Tomate', 1],
                ['Cebolla', 1],
            ],
            slug: "pancho1",
            active: true,
        },
        {
            nombre: "papas fritas",
            categoria: 'guarnicion',
            imagen: 'nro5.jpeg',
            precio: 450,
            descripcion: "Papas fritas con queso",
            estimatedTimeMinutes: 15,
            recipe: [
                ['Queso', 2],
                ['Tomate', 1],
                ['Cebolla', 1],
            ],
            slug: "papas_fritas1",
            active: true,
        },
            
    ]
}