// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().forEach(context);

// translation const
export const ENGLISH_TRANSLATIONS = {
  titles: {
    profile: 'Profile',
    about: 'About Us',
    myaccount: 'My account',
    users: {
      root: 'Users',
      profile: 'User Profile',
      myaccount: 'List Users',
    },
  },
  routes: {
    about: 'aboutUs',
    myaccount: 'myAccount',
  },
};
