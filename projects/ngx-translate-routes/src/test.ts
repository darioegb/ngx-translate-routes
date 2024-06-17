// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js'
import 'zone.js/testing'
import { getTestBed } from '@angular/core/testing'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing'

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false },
  },
)

// translation const
const ENGLISH_TRANSLATIONS = {
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
    about: {
      root: 'aboutAs',
      params: {
        name: 'name',
      },
    },
    myaccount: 'myAccount',
  },
}

const SPANISH_TRANSLATIONS = {
  titles: {
    profile: 'Perfil',
    about: 'Sobre Nosotros',
    myaccount: 'Mi cuenta',
    users: {
      root: 'Usuarios',
      profile: 'Perfil de Usuario',
      myaccount: 'List Users',
    },
  },
  routes: {
    profile: 'perfil',
    about: {
      root: 'sobreNosotros',
      params: {
        name: 'nombre',
      },
    },
    myaccount: 'miCuenta',
    users: 'usuarios',
  },
}

export const TRANSLATIONS = {
  es: SPANISH_TRANSLATIONS,
  en: ENGLISH_TRANSLATIONS,
}
