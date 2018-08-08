import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import $ from 'jquery';
import { Link } from 'react-router';
import Helpers from '../../../../core/common/helpers';
import { setLoading } from '../../../../core/actions/actions';
import Icon from '../../../../core/common/lib/icon/icon';
import World from '../../../../../../static/svg/world.svg';
import Logo from '../../../../../../static/svg/logo.svg';


const { isLoaded, isEmpty, dataToJS } = helpers;

@firebase(['files', 'posts', 'courses', 'levels'])
@connect(state => ({
  files: dataToJS(state.firebase, 'files'),
  courses: dataToJS(state.firebase, 'courses'),
  posts: dataToJS(state.firebase, 'posts'),
  levels: dataToJS(state.firebase, 'levels')
}))
class Home extends Component {

  componentDidMount() {
    this.props.setLoading(false); // Move this to API callback when implemented (if ever)
    $('.js-main').removeClass().addClass('main js-main home-page has-hero');

    $('.hero .world-map').show().animateCss('slideInUp', () => {
      $('.hero .hero-content').show().animateCss('fadeInUp', () => {
        $('.hero .elevator-pitch').show().animateCss('fadeInUp');
        $('.hero .circle').show().animateCss('fadeInUp');
      });
    });
  }

  render() {
    let coursesList = <div className="loader-small" />;
    let postsList = <div className="loader-small" />;

    if (isLoaded(this.props.courses) && !isEmpty(this.props.courses) && isLoaded(this.props.files) && !isEmpty(this.props.files) && isLoaded(this.props.levels) && !isEmpty(this.props.levels)) {
      coursesList = <ul className="cards-list posts-list">{Helpers.renderCards('courses', this.props)}</ul>;
    }

    if (isLoaded(this.props.posts) && !isEmpty(this.props.posts) && isLoaded(this.props.files) && !isEmpty(this.props.files)) {
      postsList = <ul className="cards-list posts-list">{Helpers.renderCards('blog', this.props)}</ul>;
    }

    return (
      <section className="home page">
        <div className="hero">
          <Icon glyph={World} className="world-map" />
          <div className="hero-content">
            <Icon glyph={Logo} className="logo" />
            <div className="slogan">
              <div className="word word1">Open</div>
              <div className="word word2">Realtime</div>
              <div className="word word3">Education</div>
            </div>
          </div>
          <div className="elevator-pitch">
            <p>You Can is an international learning platform. You can study anytime, anywhere and network with your classmates around the world! You can also earn money by uploading your courses...</p>
            <p>
              <button className="btn btn-primary">Upload your course now</button>
            </p>
          </div>


          <div className="line teacher-l1" />
          <div className="line teacher-l2" />
          <div className="line teacher-l3" />
          <div className="line teacher-l4" />
        </div>
        <div className="cards courses">
          <h2 className="cards-heading">Latest courses</h2>
          {coursesList.type === 'ul' ? coursesList :
          <Link to="/upload">
            <button className="btn btn-primary">Upload your first course</button>
          </Link>}
        </div>
        <div className="cards posts">
          <h2 className="cards-heading">Latest stories</h2>
          {postsList.type === 'ul' ? postsList :
          <Link to="/admin">
            <button className="btn btn-primary">Write your first post</button>
          </Link>}
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop
  }
}) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Home);
