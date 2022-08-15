import { FC } from "react";
import { Slide } from "react-slideshow-image";
import 'react-slideshow-image/dist/styles.css';
import styles from "./ProductSlideshow.module.css";

interface Props {
    imagen: string;
}

export const ProductSlideshow: FC<Props> = ({ imagen }) => {
  return (
    <Slide
        easing="ease"
        duration={7000}
        indicators
    >
        <div className={ styles['each-slide'] } key={ imagen }>
            <div style={{
                backgroundImage: `url(${ imagen })`,
                backgroundSize: 'cover'
            }}>
                
            </div>
        </div>
    </Slide>
  )
}
