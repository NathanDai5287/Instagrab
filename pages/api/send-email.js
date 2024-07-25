import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { username, timestamp } = req.body;

		const transporter = nodemailer.createTransport({
			service: 'gmail', // Or another service if applicable
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: '7607172199@msg.fi.google.com',
			subject: '', // No subject
			text: `Username: ${username}\nTimestamp: ${timestamp}`, // Email body
		};

		try {
			await transporter.sendMail(mailOptions);
			res.status(200).json({ success: true });
		} catch (error) {
			console.error('Error sending email:', error);
			res.status(500).json({ success: false, error: 'Failed to send email' });
		}
	} else {
		// Handle any non-POST requests
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
