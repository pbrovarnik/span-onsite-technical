import { createRoot } from 'react-dom/client';
import App from './optimized-attempt.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<>
		<App />
	</>
);
