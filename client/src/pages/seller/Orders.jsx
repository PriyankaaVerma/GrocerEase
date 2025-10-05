import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
    const {currency, axios} = useAppContext()
    const [orders, setOrders] = useState([])
    const [error, setError] = useState(null)

    const fetchOrders = async () =>{
        try {
            const { data } = await axios.get('/api/order/seller');
            if(data.success && Array.isArray(data.orders)){
                setOrders(data.orders)
            }else{
                setOrders([])
                setError(data.message || "No orders found.")
            }
        } catch (error) {
            setError(error.message)
            toast.error(error.message)
        }
    };


    useEffect(()=>{
        fetchOrders();
    },[])


  return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                {error && <p className="text-red-500 font-medium mb-4">{error}</p>}
                {(!orders || orders.length === 0) && !error && (
                    <p className="text-gray-500 font-medium">No orders found.</p>
                )}
                {orders && Array.isArray(orders) && orders.map((order, index) => (
                    <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
                        <div className="flex gap-5 max-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                            <div>
                                {order.items && Array.isArray(order.items) ? order.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <p className="font-medium">
                                            {item.product && item.product.name ? item.product.name : "Unknown Product"}{" "}
                                            <span className="text-primary">x {item.quantity}</span>
                                        </p>
                                    </div>
                                )) : <p className="text-gray-400">No items found.</p>}
                            </div>
                        </div>
                        <div className="text-sm md:text-base text-black/60">
                            <p className='text-black/80'>
                                {order.address && order.address.firstName ? order.address.firstName : ""} {order.address && order.address.lastName ? order.address.lastName : ""}
                            </p>
                            <p>{order.address && order.address.street ? order.address.street : ""}, {order.address && order.address.city ? order.address.city : ""}</p>
                            <p>{order.address && order.address.state ? order.address.state : ""}, {order.address && order.address.zipcode ? order.address.zipcode : ""}, {order.address && order.address.country ? order.address.country : ""}</p>
                            <p>{order.address && order.address.phone ? order.address.phone : ""}</p>
                        </div>
                        <p className="font-medium text-lg my-auto">
                            ₹{order.amount}
                        </p>
                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Method: {order.paymentType}</p>
                            <p>Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}</p>
                            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default Orders
