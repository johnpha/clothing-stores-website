import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { isAdmin, isAuth } from '../util.js';

const uploadRouter = express.Router();

cloudinary.config({
	cloud_name: 'dvacpxowr',
	api_key: '332675825669486',
	api_secret: 'Q67wZdZQDoydV9TZhTn_o4I4IA8',
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'DEV',
	},
});

const upload = multer({ storage: storage });

uploadRouter.post(
	'/',
	isAuth,
	isAdmin,
	upload.single('file'),
	async (req, res) => {
		return res.json({ file: req.file.path });
	}
);

export default uploadRouter;

/*
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
	'/',
	//isAuth,
	//isAdmin,
	upload.single('file'),
	async (req, res) => {
		cloudinary.config({
			cloud_name: 'dvacpxowr',
			api_key: '332675825669486',
			api_secret: 'Q67wZdZQDoydV9TZhTn_o4I4IA8',
		});
		const streamUpload = (req) => {
			return new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream((error, result) => {
					if (result) {
						resolve(result);
					} else {
						reject(error);
					}
				});
				streamifier.createReadStream(req.file.buffer).pipe(stream);
			});
		};
		const result = await streamUpload(req);
		res.send(result);
	}
);
export default uploadRouter;
*/
