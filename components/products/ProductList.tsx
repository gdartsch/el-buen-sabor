import { FC } from "react"
import { Grid } from "@mui/material"
import { IProduct } from "../../interfaces"
import { ProductCard } from "./ProductCard";
import { useIngredients } from "../../hooks";

interface Props {
    products: IProduct[];
}

export const ProductList: FC<Props> = ({products}) => {

    return (
        <Grid container spacing={4}>
            {
                products.map(product => (
                    <ProductCard
                        key={product.slug}
                        product={ product }
                    />
                ))
            }
        </Grid>
    )
}
