import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/App/App';
import { reducerStore } from './redux/reducerStore';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <React.StrictMode>
        <Provider store={reducerStore}>
            <App />
        </Provider>
    </React.StrictMode>
)
