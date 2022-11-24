import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel'
import slaider1img from '../assets/slaider1.jpg';
import slaider2img from '../assets/slaider2.jpg';
import slaider3img from '../assets/slaider3.jpg';
import slaider4img from '../assets/slaider4.jpg';


export default class CarouselBox extends Component{
    render(){
        return (
            <Carousel>
                <Carousel.Item>
                    <img
                    width={900}
                    height={900}
                    className="d-block w-100"
                    src={ slaider1img }
                    alt="slaider1"
                    />
                    <Carousel.Caption>
                        <h3> Резервуар картинка </h3>
                        <p>что то там</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    width={900}
                    height={900}
                    className="d-block w-100"
                    src={ slaider2img }
                    alt="slaider2"
                    />
                    <Carousel.Caption>
                        <h3> Резервуар картинка </h3>
                        <p>что то там</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    width={900}
                    height={900}
                    className="d-block w-100"
                    src={ slaider3img }
                    alt="slaider4"
                    />
                    <Carousel.Caption>
                        <h3> Резервуар картинка </h3>
                        <p>что то там</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                    width={900}
                    height={900}
                    className="d-block w-100"
                    src={ slaider4img }
                    alt="slaider4"
                    />
                    <Carousel.Caption>
                        <h3> Резервуар картинка </h3>
                        <p>что то там</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        )
    }
}