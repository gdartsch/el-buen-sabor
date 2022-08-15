import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});

    if(!session){
        //const requestedPage = req.page.name
        //return NextResponse.redirect(`/auth/login?p=${requestedPage}`);
        const { origin, pathname } = req.nextUrl.clone();
        return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
    }

    const validRoles = ['Admin', 'Chef', 'Cashier', 'Delivery'];

    if(!validRoles.includes(session.user.role)){
        return NextResponse.redirect('/');
    }

    return NextResponse.next();
}