import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';
import firebase from 'firebase';
import { ADMIN_LEVEL } from './core/constants/constants';
import store, { history } from './store';
import './bundle.scss';
import App from './core/app';
import Home from './themes/youcanparts/pages/home/home';
import Dashboard from './themes/youcanparts/pages/dashboard/dashboard';
import AccountSettings from './themes/youcanparts/pages/account/settings';
import AccountNotifications from './themes/youcanparts/pages/account/notifications';
import Listing from './themes/youcanparts/pages/listing/listing';
import Page from './themes/youcanparts/pages/page/page';
import Post from './themes/youcanparts/pages/post/post';
import Course from './themes/youcanparts/pages/course/course';
import Subject from './themes/youcanparts/pages/subject/subject';
import Module from './themes/youcanparts/pages/module/module';
import Activity from './themes/youcanparts/pages/activity/activity';
import NotFound from './themes/youcanparts/pages/notFound/notFound';
import Admin from './core/admin/admin';
import Orgnaizer from './themes/youcanparts/pages/orgnaizer/orgnaizer';

// Google Analytics initializacion
ReactGA.initialize('UA-00000000-1', {
  debug: false,
  titleCase: false,
  gaOptions: {}
});

function logPageView() {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.set({ page: window.location.href });
    ReactGA.pageview(window.location.href);
  }
}

function requireAuth(nextState, replace, callback) {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user || !user.emailVerified) {
      history.push('/');
    } else {
      let requiresLevel = 0;
      nextState.routes.map((route) => {
        if (route.level) {
          requiresLevel = route.level;
        }
        return false;
      });
      if (requiresLevel > 0) {
        firebase.database().ref(`/users/${user.uid}`).once('value').then((snapshot) => {
          if (!snapshot.val() || !snapshot.val().info.level || (snapshot.val().info.level < requiresLevel)) {
            history.push('/');
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    }
  });
}

// Router initialization
ReactDOM.render(
  <Provider store={store}>
    <Router
      onUpdate={() => {
        window.scrollTo(0, 0);
        logPageView();
      }} history={history}
    >
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
        <Route path="/account" component={AccountSettings} onEnter={requireAuth} />
        <Route path="/account/notifications" component={AccountNotifications} onEnter={requireAuth} />
        <Route path="/courses" component={Listing} />
        <Route path="/courses/:slug" component={Course} />
        <Route path="/courses/:slug/register" component={Course} />
        <Route path="/courses/:slug/subjects" component={Course} />
        <Route path="/courses/:slug/fees" component={Course} />
        <Route path="/courses/:slug/requirements" component={Course} />
        <Route path="/subjects" component={Listing} />
        <Route path="/subjects/:slug" component={Subject} />
        <Route path="/subjects/:slug/modules" component={Subject} />
        <Route path="/subjects/:slug/activities" component={Subject} />
        <Route path="/modules" component={Listing} />
        <Route path="/modules/:slug" component={Module} />
        <Route path="/activities" component={Listing} />
        <Route path="/activities/:slug" component={Activity} />
        <Route path="/blog" component={Listing} />
        <Route path="/blog/:slug" component={Post} />
        <Route path="/about" component={Page} />
        <Route path="/about/jobs" component={Page} />
        <Route path="/about/contact" component={Page} />
        <Route path="/admin" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
        <Route path="/admin/:type/:action" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
        <Route path="/admin/:type/:action/:slug" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
        <Route path="/orgnaizer" component={Orgnaizer} level={4} onEnter={requireAuth} />
        <Route path="/orgnaizer/:type/:action" component={Orgnaizer} level={4} onEnter={requireAuth} />
        <Route path="/orgnaizer/:type/:action/:slug" component={Orgnaizer} level={4}  onEnter={requireAuth} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>, document.getElementById('react-root')
);
