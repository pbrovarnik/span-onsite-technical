import { Dispatch, memo, useEffect, useRef, useState } from 'react';
import './App.css';

type PowerSourceName = 'Home' | 'Grid' | 'Solar' | 'Battery' | 'EV';

type PowerSource = {
	id: number;
	name: PowerSourceName;
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

type SourceProps = { id: number; name: PowerSourceName; watts: number; setState?: Dispatch<React.SetStateAction<PowerSource[]>> };

const Source = memo(({ id, name, watts, setState }: SourceProps) => {
	const [intervalTime, setIntervalTime] = useState<number>(2000);

	const prevWattRef = useRef<number>(0);
	const electricityContainerRef = useRef<HTMLDivElement>(null);

	const percent = getWatttPercentDiff(prevWattRef.current, watts);

	useEffect(() => {
		prevWattRef.current = watts;

		if (!setState) return;

		const intervalId = setInterval(() => {
			setIntervalTime(Math.floor(randomNumber(5000, 1000)));
			setState((prev) => {
				const sourceIdx = prev.findIndex((source) => source.id === id);
				const source = prev[sourceIdx];
				prev[sourceIdx].watts = randomNumber(source.maxWatt, source.minWatt);

				return [...prev];
			});
		}, intervalTime);

		triggerAnimation();

		return () => {
			clearInterval(intervalId);
		};
	}, [id, intervalTime, setState, watts]);

	const triggerAnimation = () => {
		electricityContainerRef.current?.classList.add('animate');

		setTimeout(() => {
			electricityContainerRef.current?.classList.remove('animate');
		}, 1000);
	};

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
					<div ref={electricityContainerRef} className="electricity-container">
						<div className="electricity" />
					</div>
				</div>
			)}
		</>
	);
});

function getWatttPercentDiff(oldNumber: number, newNumber: number) {
	const difference = newNumber - oldNumber;
	const percentDiff = (difference / oldNumber) * 100;

	return percentDiff === Infinity || percentDiff === -Infinity || isNaN(percentDiff) ? 0 : Math.round(percentDiff);
}

function randomNumber(max: number, min: number) {
	return Math.random() * (max - min) + min;
}

export default App;
