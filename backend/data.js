import bcrypt from 'bcryptjs';

const data = {
	users: [
		{
			name: 'John',
			email: 'admin@gmail.com',
			password: bcrypt.hashSync('123456'),
			isAdmin: true,
		},
		{
			name: 'Alice',
			email: 'alice@gmail.com',
			password: bcrypt.hashSync('123'),
			isAdmin: false,
		},
	],
	products: [
		{
			name: 'Nike Slim shirt',
			slug: 'nike-slim-shirt',
			category: 'Shirt',
			image: '/images/p1.jpg',
			price: 128,
			countInStock: 10,
			brand: 'Nike',
			rating: 4.5,
			numReviews: 10,
			description: 'high quality shirt',
		},
		{
			name: 'Adidas Fit shirt',
			slug: 'Adidas-fit-shirt',
			category: 'Shirt',
			image: '/images/p2.jpg',
			price: 250,
			countInStock: 20,
			brand: 'Adidas',
			rating: 4.0,
			numReviews: 10,
			description: 'high quality product',
		},
		{
			name: 'Nike Slim pant',
			slug: 'nike-slim-pant',
			category: 'Pant',
			image: '/images/p3.jpg',
			price: 25,
			countInStock: 0,
			brand: 'Nike',
			rating: 3.5,
			numReviews: 14,
			description: 'high quality product',
		},

		{
			name: 'Adidas Fit pant',
			slug: 'Adidas-fit-pain',
			category: 'Pant',
			image: '/images/p4.jpg',
			price: 65,
			countInStock: 5,
			brand: 'Adidas',
			rating: 3,
			numReviews: 10,
			description: 'high quality product',
		},
	],
};
export default data;
