import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'animate.css/animate.css';
import Login from './pages/login';
import Home from './pages/home';
import SavedArticles from './pages/savedArticles';
import Register from './pages/register';
import Articles from './pages/articles';
import ArticleDetail from './pages/articleDetail';
import Visuals from './pages/visuals';
import About from './pages/about';
import Analaysis from './pages/analysis';
import NotFound from './components/notFound';
import NavMenu from './components/nav';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <NavMenu />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/articles/:pageNum" component={Articles} />
        <Route path="/savedarticles" component={SavedArticles} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/article/:id" component={ArticleDetail} />
        <Route path="/visuals" component={Visuals} />
        <Route path="/about" component={About} />
        <Route path="/analysis" component={Analaysis} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
