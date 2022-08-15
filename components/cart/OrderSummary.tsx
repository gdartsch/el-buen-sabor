import { Grid, Typography } from "@mui/material"
import { FC, useContext, useState } from "react";
import { elBuenSaborApi } from "../../api";
import { CartContext } from "../../context";
import { currency } from "../../utils";

interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal: number;
        discount: number;
        tax: number;
        total: number; 
        estimatedTime: number;     
    },
    ordered: boolean;
    isAdmin: boolean;
}

export const OrderSummary: FC<Props> = ({orderValues, ordered = false, isAdmin = false}) => {

    const { numberOfItems, subTotal, discount, tax, total, estimatedTime } = useContext(CartContext);
    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, discount, tax, total, estimatedTime};

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(summaryValues.subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(summaryValues.tax)}</Typography>
            </Grid>

           {  
                ordered === true && (
                    <><Grid item xs={6}>
                        <Typography>Descuento</Typography>
                    </Grid><Grid item xs={6} display='flex' justifyContent='end'>
                            <Typography>{currency.format(summaryValues.discount)}</Typography>
                            </Grid></>
                )
            }
            {
                ordered === true && isAdmin === false && (
                    <><Grid item xs={6}>
                            <Typography>Tiempo estimado</Typography>
                        </Grid><Grid item xs={6} display='flex' justifyContent='end'>
                            <Typography>{summaryValues.estimatedTime}</Typography>
                        </Grid></>
                )
            }

            <Grid item xs={6} sx={{ mt:2 }}>
                <Typography variant="subtitle1">Total</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end' sx={{ mt:2 }}>
                <Typography variant="subtitle1">{currency.format(summaryValues.total)}</Typography>
            </Grid>

        </Grid>
    )
}
