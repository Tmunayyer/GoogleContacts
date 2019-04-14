import React from 'react';
import App from '../src/App.jsx';
import Navbar from '../src/components/Navbar.jsx';
import Feed from '../src/components/Feed.jsx';
import Contact from '../src/components/Contact.jsx';

import { mount, shallow, render, toContainReact } from 'enzyme';

/*
    This is my first time writing tests for React. I am following
    Jest's get tutorial to start.

    https://jestjs.io/docs/en/tutorial-react

    This was actually super easy. All it took was adding a babel.config
    file after downloading a few new modules.

    It says these snapshots should be committed along with code.

*/
