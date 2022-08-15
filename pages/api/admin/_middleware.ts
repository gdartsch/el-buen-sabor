import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});

    if(!session){
        return new Response( JSON.stringify({ 
            message: 'Debe de estar autenticado para realizar esta acción' 
        }), { 
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            } 
        });
    }

    const validRoles = ['Admin', 'Chef', 'Cashier', 'Delivery'];

    if(!validRoles.includes(session.user.role)){
        return new Response( JSON.stringify({ 
            message: 'Debe de estar autenticado para realizar esta acción' 
        }), { 
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            } 
        });
    }

    return NextResponse.next();
}