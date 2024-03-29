import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Checkbox, Radio } from "antd";
import { Prices } from '../Components/Prices';
import { useCart } from '../context/cart';
import "../styles/HomePage.css"



const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);


    // get all Cat
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category')
            if (data?.success) {
                setCategories(data?.category)
            }
        } catch (error) {


        }
    }
    useEffect(() => {
        getAllCategory();
        GetTotal();
    }, []);

    // get Products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false)
            setProducts(data.products);
            toast.success("Welcome to HomePage😃")

        } catch (error) {
            setLoading(false)

            toast.error("Something Went Wrong😥")

        }
    };

    // GetTotal Count 
    const GetTotal = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/product-count")
            setTotal(data?.total)

        } catch (error) {


        }

    };

    useEffect(() => {
        if (page === 1) return /* Here execution of if statment close and loadMorefucn will run*/
        loadMore()
        // eslint-disable-next-line
    }, [page])

    // Load More Function 

    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`)
            setLoading(false)
            setProducts([...products, ...data?.products])

        } catch (error) {

            setLoading(false)

        }
    }


    // Filter per Category
    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);

    }

    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
        // eslint-disable-next-line
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
        // eslint-disable-next-line
    }, [checked, radio])
    // Get Filter Product 
    const filterProduct = async () => {
        try {
            const { data } = await axios.post("/api/v1/product/product-filters", {
                checked,
                radio,
            });
            setProducts(data?.products);
        } catch (error) {


        }
    }

    return (
        <div>
            <Layout title={"All Products - Best Offers"}>
                <img
                    src="/images/banner.png"
                    className="banner-img"
                    alt="bannerimage"
                    width={"100%"}
                />
                {/* banner image */}
                <div className='row mt-3 home-page'>
                    <div className='col-md-3'>
                        <h4 className='text-center'>Filter By Category</h4>
                        <div className='d-flex flex-column'>
                            {categories?.map((c) => (
                                <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                    {c.name}
                                </Checkbox>
                            ))}
                        </div>
                        {/* Price Filter */}
                        <h4 className='text-center mt-4'>Filter By Price</h4>
                        <div className='d-flex flex-column'>
                            <Radio.Group onChange={e => setRadio(e.target.value)}>
                                {Prices?.map(p => (
                                    <div key={p._id}>
                                        <Radio value={p.array}>{p.name}</Radio>
                                    </div>

                                ))}
                            </Radio.Group>
                        </div>
                        <div className='d-flex flex-column'>
                            <button className='btn btn-danger' onClick={() => window.location.reload()}>RESET FILTERS</button>
                        </div>
                    </div>
                    <div className='col-md-9 '>
                        <h1 className='text-center'>All Products</h1>
                        <div className='d-flex flex-wrap'>
                            {products?.map((p) => (
                                <div className="card m-2" style={{ width: '18rem' }} >
                                    <img
                                        src={`/api/v1/product/product-photo/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 50)}...</p>
                                        <p className="card-text" > $ {p.price}</p>
                                        <button class='btn btn-primary ms-1'
                                            onClick={() => navigate(`/product/${p.slug}`)}>
                                            More Details
                                        </button>
                                        <button class='btn btn-secondary ms-1'
                                            onClick={() => {
                                                setCart([...cart, p])
                                                localStorage.setItem('cart', JSON.stringify([...cart, p]))
                                                toast.success("Item Added to cart")
                                            }}
                                        >ADD TO CART</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='m-2 p-3'>
                            {products && products.length < total && (
                                <button
                                    className='btn btn-warning loadmore'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setPage(page + 1)

                                    }}>
                                    {loading ? "Loading..." : "Loadmore"}
                                </button>
                            )}

                        </div>
                    </div>
                </div>

            </Layout >
        </div >
    )
}

export default HomePage