import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, users: action.payload };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'DELETE_REQUEST':
			return { ...state, loadingDelete: true, successDelelte: false };
		case 'DELETE_SUCCESS':
			return { ...state, loadingDelete: false, successDelelte: true };
		case 'DELETE_FAIL':
			return { ...state, loadingDelete: false };
		case 'DELETE_RESET':
			return { ...state, loadingDelete: false, successDelelte: false };
		default:
			return state;
	}
};

export default function UserListScreen() {
	const [{ loading, error, users, loadingDelete, successDelelte }, dispatch] =
		useReducer(reducer, {
			loading: true,
			error: '',
		});

	const { state } = useContext(Store);
	const { userInfo } = state;
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQURST' });
				const { data } = await axios.get('/api/users', {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (error) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
			}
		};
		if (successDelelte) {
			dispatch({ type: 'DELETE_RESET' });
		} else {
			fetchData();
		}
	}, [userInfo, successDelelte]);

	const deletehandler = async (user) => {
		if (window.confirm('Are you sure to delete')) {
			try {
				dispatch({ type: 'DELETE_REQUEST' });
				await axios.delete(`/api/users/${user._id}`, {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				toast.success('User deleted successfully');
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
				<title>Users</title>
			</Helmet>
			<h1>Users</h1>
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
							<th>Name</th>
							<th>Email</th>
							<th>Is Admin</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>{user.isAdmin ? 'YES' : 'NO'}</td>
								<td>
									<Button
										type="button"
										onClick={() => navigate(`/admin/user/${user._id}`)}
									>
										Edit
									</Button>
									&nbsp;
									<Button type="button" onClick={() => deletehandler(user)}>
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
