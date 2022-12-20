import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel'
import slaider1img from '../assets/slaider1.jpg';
import slaider2img from '../assets/slaider2.jpg';
import slaider3img from '../assets/slaider3.jpg';
import slaider4img from '../assets/slaider4.jpg';


export default class CarouselBox extends Component{

    render(){
        const imgsClassName = "d-block w-100 image-setting-home";

        return (
            <Carousel>
                <Carousel.Item>
                    <img
                    srcSet={`${slaider1img} 320w, ${slaider1img} 680w, ${slaider1img}   960w, ${slaider1img} 1980w`}
                    className={imgsClassName}
                    src={ slaider1img }
                    alt="slaider1"
                    />
                    <Carousel.Caption>
                        <h1> Резервуар - это что такое? </h1>
                        <h2> Резервуары вертикальные стальные — это огромная емкость прямоугольной либо цилиндрической формы, предназначенная для хранения, обработки, выдачи разных нефтепродуктов, воды, кислот, щелочей, сжиженных газов. Такие сосуды применяются во всех промышленных отраслях, где есть необходимость накопления запасов. </h2>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    srcSet={`${slaider2img} 320w, ${slaider2img} 680w, ${slaider2img}   960w, ${slaider2img} 1980w`}
                    className={imgsClassName}
                    src={ slaider2img }
                    alt="slaider2"
                    />
                    <Carousel.Caption>
                        <h1> Материалы резервуара </h1>
                        <h2> В зависимости от использованного в производстве сырья все емкости разделяют на: </h2>
                        <h2> - металлические (стальные, алюминиевые); </h2>
                        <h2> - неметаллические (стеклопластиковые, резинотканевые, железобетонные). </h2>
                        <h2> Выбор материала для сосуда напрямую зависит от вида жидкости, которая в нем будет находиться. </h2>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    srcSet={`${slaider3img} 320w, ${slaider3img} 680w, ${slaider3img}   960w, ${slaider3img} 1980w`}
                    className={imgsClassName}
                    src={ slaider3img }
                    alt="slaider4"
                    />
                    <Carousel.Caption>
                        <h1> По форме промышленные емкости бывают: </h1>
                        <h2> - цилиндрические; </h2>
                        <h2> - шаровые; </h2>
                        <h2> - прямо- и многоугольные; </h2>
                        <h2> - сложные (например, каплевидные). </h2>
                        <h2> Изделия последней группы производятся в малых количествах, (зачастую для проведения экспериментов), широкого практического применения они не имеют. </h2>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    srcSet={`${slaider4img} 320w, ${slaider4img} 680w, ${slaider4img}   960w, ${slaider4img} 1980w`}
                    className={imgsClassName}
                    src={ slaider4img }
                    alt="slaider4"
                    />
                    <Carousel.Caption>
                        <h1> Потребность резервуаров </h1>
                        <h2> Резервуарное оборудование необходимо везде, где присутствует потребность в транспортировке, хранении нефтепродуктов: на месторождениях нефти, нефтеперерабатывающих заводах, нефтехимических предприятиях. Поскольку разные виды сырья отличаются по характеристикам, то в каждом конкретном случае изготовление металлоконструкций проходит по-разному. Однако строение всех резервуаров для нефтепродуктов аналогичное. </h2>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        )
    }
}