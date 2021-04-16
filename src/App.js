import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Login from './pages/login';
import Home from './pages/home';
import About from './pages/about';
import Register from './pages/register';
import Nav from './components/nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </Router>
  );
}

export default App;
