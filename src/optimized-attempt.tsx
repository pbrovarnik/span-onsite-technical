import { Dispatch, memo, useEffect, useRef, useState } from 'react';
import './App.css';

type PowerSource = {
	id: number;
	name: 'Grid' | 'Solar' | 'Battery' | 'EV';
	watts: number;
	maxWatt: number;
	minWatt: number;
};

function App() {
	const [powerSources, setPowerSources] = useState<PowerSource[]>([
		{ id: 1, name: 'Grid', watts: 0, maxWatt: 10, minWatt: 5 },
		{ id: 2, name: 'Solar', watts: 0, maxWatt: 4, minWatt: 2 },
		{ id: 3, name: 'Battery', watts: 0, maxWatt: 5, minWatt: 1 },
		{ id: 4, name: 'EV', watts: 0, maxWatt: 3, minWatt: 1 },
	]);

	const homeWatts = powerSources.reduce((prev, curr) => {
		if (curr.name === 'Solar') {
			prev -= curr.watts;
		} else {
			prev += curr.watts;
		}

		return prev;
	}, 0);

	return (
		<div className="app">
			<Source id={5} name="Home" watts={homeWatts} />
			{powerSources.map(({ id, name, watts }) => {
				return <Source key={id} id={id} name={name} watts={watts} setState={setPowerSources} />;
			})}
		</div>
	);
}

type SourceProps = { id: number; name: string; watts: number; setState?: Dispatch<React.SetStateAction<PowerSource[]>> };

const Source = memo(({ id, name, watts, setState }: SourceProps) => {
	const [intervalTime, setIntervalTime] = useState<number>(2000);
	const [percentDiff, setPercentDiff] = useState<number>(0);
	const [triggerAnimation, setTriggerAnimation] = useState(false);

	const prevWattRef = useRef<number>(0);

	const percent = Math.round(percentDiff);

	useEffect(() => {
		if (!setState) {
			setPercentDiff(percentDifference(prevWattRef.current, watts));
			prevWattRef.current = watts;
			return;
		}

		const intervalId = setInterval(() => {
			setIntervalTime(Math.floor(randomNumber(5000, 1000)));
			setState((prev) => {
				const sourceIdx = prev.findIndex((source) => source.id === id);
				const source = prev[sourceIdx];
				const watts = randomNumber(source.maxWatt, source.minWatt);

				setPercentDiff(percentDifference(prevWattRef.current, watts));
				prev[sourceIdx].watts = randomNumber(source.maxWatt, source.minWatt);
				prevWattRef.current = watts;
				return [...prev];
			});
		}, intervalTime);

		setTriggerAnimation(true);

		setTimeout(() => {
			setTriggerAnimation(false);
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [id, intervalTime, setState, watts]);

	return (
		<>
			<div className={`power-source ${name.toLowerCase()}`}>
				<div className="power-source-name">{name}</div>
				<div className="power-source-data">
					<span>{watts.toFixed(2)}W</span>
					<span
						style={{
							color: percent > 0 ? 'green' : percent < 0 ? 'red' : 'unset',
						}}
						className="percent-diff">
						{percent > 0 ? <span>&#x2191;</span> : percent < 0 ? <span>&#x2193;</span> : ''}
						<span> {percent}%</span>
					</span>
				</div>
			</div>
			{name !== 'Home' && (
				<div className={`line ${name.toLowerCase()}`}>
					<div className={`electricity-container ${triggerAnimation ? 'animate' : ''}`}>
						<div className="electricity" />
					</div>
				</div>
			)}
		</>
	);
});

function percentDifference(oldNumber: number, newNumber: number) {
	const difference = newNumber - oldNumber;
	const percentDiff = (difference / oldNumber) * 100;

	return percentDiff === Infinity || percentDiff === -Infinity || isNaN(percentDiff) ? 0 : percentDiff;
}

function randomNumber(max: number, min: number) {
	return Math.random() * (max - min) + min;
}

export default App;
