# Frontend (React + Typescript)

## Branch in Git

Frontend => origin/Frontend
(git checkout frontend)

## Additional Packages

### Material UI (MUI)

#### URL

https://mui.com/

#### install

npm install @mui/material @emotion/react @emotion/styled

### Roboto font

#### install

npm install @fontsource/roboto

and add

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

in the entry point (Main.tsx)

### Material UI Icons

#### install

npm install @mui/icons-material

### React Router

#### install

npm install react-router-dom

### [package]

# Authorization

## Auth0

Auth0 allows you to add authentication.

https://auth0.com

### Sign Up

On the Auth0 Sign Up (It's free)
27X11x1949@@

> > > RECOVERY CODE: RVE9CHTSZ8GFQ2QSA6MU1F8W

On the dashboard, go to 'Applications/Applications' and create a new application. Give it a name and select the type (in this case a SPA). Tell them the technologie used (React). Go to the Settings page and select SPA in 'Application Type'. In 'Allowed Callback URLs' we enter the application URL (http://localhost:5173). Copy this also in 'Allowed Logout URLs' and 'Allowed Web Origins'. That's it. SAVE the changes.

In our root directory, create an .env file.
In the file set the information you can find on the Auth0 site (when you log in and select the created application)

```
VITE_AUTH0_DOMAIN=dev-...
VITE_AUTH0_CLIENTID=6ie...
```

# Testing Environment

## ViTest

testing framework. Test file alsways have the form of '<some name>.test.tsx

### setting up

#### install

npm install -D vitest

#### scripts

in 'package.json' add next scripts:

    "test": "vitest",
    "test:ui": "vitest --ui"

#### run

```terminal
npm run test (or npm test or npm t)
OR
npm run test:ui (graphical version, the first time: answer 'y' on their question and run the command again)
```

## react-testing-library

Let us render the component and interact with them.

### setting up

#### install

npm i @testing-library/react

## jsDom

The tests are executed in a Node environment. But node doesn't know anything about browsers  
and DOMs. To emulate a browser environment, we need jsDom.

### setting up

#### install

npm i jsdom

#### ViTest config

In the root directory add the file 'vitest.config.ts' with content

```
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
```

We changed the vitest configuration, so we should restart vitest (npm run test:ui).

## jest-dom

Contains matchers which we can use in the tests.

### setting up

#### install

npm i @testing-library/jest-dom

#### use

In the test file, we should import these matchers like:

'''
import '@testing-library/jest-dom/vitest';
'''

#### simplify

In vitest configuration file, add:

'''
globals: true
'''

In tsconfig.app.json (by the compiler options), add:

'''
"types": ["vitest/globals"]
'''

Create the file 'tests/setup.ts', and put in here the jest-dom import

'''
import '@testing-library/jest-dom/vitest';
'''

and in the vitest configuration file (vitest.config.ts), we add:

'''
setupFiles: 'tests/setup.ts'
'''
This setup file is run before each test file, so we don't need that import anymore in our test files.
(REMEMBER: Restart Vitest with npm run test:ui).

#### VsCode plugin for ViTest

Allows use to type 'itr'. This will execute:

'''
import { render, screen } from "@testing-library/react"
'''

## MSW

### setting up

#### install

## Auth0

### setting up

### install

npm i @auth0/auth0-react

# GIT

show the branches
git branch

change branch (here to main branch)
git checkout main

merge brancha into branchb

