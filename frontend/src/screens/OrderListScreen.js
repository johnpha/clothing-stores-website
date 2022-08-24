import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, orders: action.payload };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'DELETE_REQUEST':
			return { ...state, loadingDelete: true, successDelete: false };
		case 'DELETE_SUCCESS':
			return { ...state, loadingDelete: false, successDelete: true };
		case 'DELETE_FAIL':
			return { ...state, loadingDelete: false };
		case 'DELETE_RESET':
			return { ...state, loadingDelete: false, successDelete: false };
		default:
			return state;
	}
};

export default function OrderListScreen() {
	const navigate = useNavigate();
	const { state } = useContext(Store);

	const { userInfo } = state;
	const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
		useReducer(reducer, {
			loading: true,
			error: '',
		});

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get('/api/orders', {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (error) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
			}
		};
		if (successDelete) {
			dispatch({ type: 'DELETE_RESET' });
		} else {
			fetchData();
		}
	}, [userInfo, successDelete]);

	const deleteHandler = async (order) => {
		if (window.confirm('Are you sure to delete this order')) {
			try {
				dispatch({ type: 'DELETE_REQUEST' });
				await axios.delete(`/api/orders/${order._id}`, {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				toast.success('Order deleted successfully');
				dispatch({ type: 'DELETE_SUCCESS' });
			} catch (error) {
				toast.error(getError(error));
				dispatch({ type: 'DELETE_FAIL' });
			}
		}
	};

	return (
		<div>
			<Helmet>
				<title>Orders</title>
			</Helmet>
			<h1>Orders</h1>
			{loadingDelete && <LoadingBox></LoadingBox>}
			{loading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<table className="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>User</th>
							<th>Date</th>
							<th>Total</th>
							<th>Paid</th>
							<th>Delivered</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>{order._id}</td>
								<td>{order.user ? order.user.name : 'Deleted User'}</td>
								<td>{order.createdAt.substring(0, 10)}</td>
								<td>{order.totalPrice.toFixed(2)}</td>
								<td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
								<td>
									{order.isDelivered
										? order.deliveredAt.substring(0, 10)
										: 'No'}
								</td>
								<td>
									<Button
										type="button"
										onClick={() => {
											navigate(`/order/${order._id}`);
										}}
									>
										Details
									</Button>
									&nbsp;
									<Button type="button" onClick={() => deleteHandler(order)}>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
