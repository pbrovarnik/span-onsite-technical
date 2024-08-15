import { Dispatch, useEffect, useState } from 'react';

type PowerSource = {
	id: number;
	value: string;
	watts: number;
	setState?: Dispatch<React.SetStateAction<number>>;
};

const randomNumber = (max: number) => Math.random() * max;

function App() {
	const [grid, setGrid] = useState(randomNumber(10));
	const [solar, setSolar] = useState(randomNumber(4));
	const [battery, setBattery] = useState(randomNumber(5));
	const [ev, setEV] = useState(randomNumber(3));

	const home = grid + ev + battery - solar;

	// an array to hold all the power sources.
	const powerSources: PowerSource[] = [
		{ id: 1, value: 'Grid', watts: grid, setState: setGrid },
		{ id: 2, value: 'Solar', watts: solar, setState: setSolar },
		{ id: 3, value: 'Home', watts: home },
		{ id: 4, value: 'Battery', watts: battery, setState: setBattery },
		{ id: 5, value: 'EV', watts: ev, setState: setEV },
	];

	useEffect(() => {
		const intervalId = setInterval(() => {
			setGrid(randomNumber(10));
			setSolar(randomNumber(4));
			setBattery(randomNumber(5));
			setEV(randomNumber(3));
		}, 5000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	// render item on the screen
	// css to style
	// grid
	// solar
	// battery
	// ev
	return (
		<div>
			{/* <div>Grid: {grid.toFixed(2)}</div>
			<div>Solar: {solar.toFixed(2)}</div>
			<div>Home: {home.toFixed(2)}</div>
			<div>Battery: {battery.toFixed(2)}</div>
			<div>EV: {ev.toFixed(2)}</div> */}
			{powerSources.map(({ id, value, watts, setState }) => {
				return <Source key={id} title={value} watts={watts} setState={setState} />;
			})}
		</div>
	);
}

// component
// setinternal
// 	- interval finished we generate a new interval with a random number 1-5s
// render the random number

const Source = ({ title, watts, setState }: { title: string; watts: number; setState?: Dispatch<React.SetStateAction<number>> }) => {
	useEffect(() => {
		const intervalId = setInterval(() => {
			if (setState) setState(randomNumber(10));
		}, 3000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<div>
			<span>{title}</span>: {watts && <span>{watts.toFixed(2)}</span>}
		</div>
	);
};

export default App;
