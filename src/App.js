import logo from './logo.svg';
import './App.css';
import MyGoogleMaps from './components/MyGoogleMaps';
import { Provider } from "react-redux"
import { createStore } from "redux"
import allReducers from "./reducer"
let store = createStore(allReducers)
function App() {
  return (
    <Provider store={store}>
      <div className="main-wrapper">
        <MyGoogleMaps />
      </div>
    </Provider>
  );
}

export default App;
