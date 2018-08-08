import React, { Component } from 'react';
import Helpers from '../../../../core/common/helpers';
import Icon from '../../../../core/common/lib/icon/icon';
import Logo from '../../../../../../static/svg/logo.svg';

class Footer extends Component {

  componentDidMount() {
    Helpers.getAppVersion('.app-version');
  }

  render() {
    return (
      <section className="footer">
        <span>you can Platform <span className="app-version" />
          <Icon glyph={Logo} />
          2018 - 2019. Licensed under barchatech
        </span>
      </section>
    );
  }
}

export default Footer;
