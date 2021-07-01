import { useEffect, useState } from 'react';

const api = {
    key: '',
    base: 'https://api.openweathermap.org/data/2.5/',
	units: 'metric'
}

function App() {
	const [query, setQuery] = useState('');
	const [weather, setWeather] = useState({});

	useEffect(() => {
		const success = pos => {
			const latitude = pos.coords.latitude;
			const longitude = pos.coords.longitude;

			fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=${api.units}&appid=${api.key}`)
				.then(res => res.json())
				.then(json => {
					setWeather(json);
					setQuery('');
				})
		}

		const error = () => alert('Unable to retrieve location, type it in search box and hit enter.');

		navigator.geolocation.getCurrentPosition(success, error);
	}, []);

	const searchWithText = evt => {
		if (evt.key === 'Enter') {
			fetch(`${api.base}weather?q=${query}&units=${api.units}&appid=${api.key}`)
				.then(response => response.json())
				.then(json => {
					setWeather(json);
					setQuery('');
				})
		}
	}

	const dateBuilder = date => {
		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
	}

	return (
		<div className="app">
			<header>
				<input
					type="text" 
					className="search-bar" 
					placeholder="SEARCH"
					onChange={ e => setQuery(e.target.value) }
					value={ query }
					onKeyPress={ searchWithText }
				/>
			</header>

			{(typeof weather.main != "undefined") ? (
				<main>
					<div className="date">
						{ dateBuilder(new Date()) }
					</div>

					<div className="temp-container">
						<span className="temp">{ Math.round(weather.main.temp) }</span>
						<span className="unit">°C</span>
					</div>
				</main>
			) : ('')}

			{(typeof weather.name !== "undefined") ? (
				<footer>
					<hr />
					<div className="location">
						{ weather.name }, { weather.sys.country }
					</div>
				</footer>
			) : ('')}
		</div>
	);
}

export default App;
