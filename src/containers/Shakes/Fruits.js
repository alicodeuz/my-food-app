import React, { useState, useEffect } from 'react';
import Card from './Card.js';
import PineApple from '../../assets/fruits/pine.jpg';
import { Container } from '../../style/StyleShake';
import axios from '../../utils/axios';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';

export default function Fruits({ bagHandler }) {
    const dispatch = useDispatch();
    const [totalValue, setTotalValue] = useState(1);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([]);

    if (!localStorage.fruits) {
        localStorage.setItem('fruits', '[]');
    }

    const clickHandler = data => {
        bagHandler();

        let parse = JSON.parse(localStorage.getItem('fruits'));
        if (parse.find(item => item._id === data._id)) {
            let findParse = parse.find(item => item._id === data._id);
            setTotalValue(findParse.total + 1);
        } else {
            parse.push(data);
            localStorage.fruits = JSON.stringify(parse);
            let parseTotal = JSON.parse(localStorage.total) + data.salePrice;
            localStorage.setItem('total', parseTotal)
        }
    }

    const getProduct = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/products/');
            console.log(res)
            setProduct(res.data)
            setLoading(false)
        }
        catch (error) {
            console.log(error, 'salom tentak')
            setLoading(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, [])

    return (
        <main>
            <Loader loading={loading} />
            <section className="home">
                <Container>
                    <div className="home__inner">
                        {
                            product.map(item => {
                                return (
                                    <Card
                                        title={item.name}
                                        text={item.description === '' ? 'Lorem ipsum dolor, sit amet consectetur adipisicing' : item.description}
                                        id={item._id}
                                        key={item._id}
                                        img={item.image}
                                        rate={item.rate}
                                        cost={item.salePrice}
                                        clickHandler={() => clickHandler(item)}
                                    />
                                )
                            })
                        }
                    </div>
                </Container>
            </section>
        </main>
    )
}