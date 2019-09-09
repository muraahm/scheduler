# Interview Scheduler
=========

## Description
A React application that allows users to book and cancel interviews. Data is persisted by the API server using a PostgreSQL database, jest tests are used through the development of the project.
The client application communicates with a WebSocket server, when a user books or cancels an interview, all connected users see the update in their browser.


## Final Product

![Image description](https://github.com/muraahm/scheduler/blob/master/docs/img%201.png)
- - -

![Image description](https://github.com/muraahm/scheduler/blob/master/docs/img%202.png)
- - -

![Image description](https://github.com/muraahm/scheduler/blob/master/docs/img%203.png)
- - -


## Dependencies

- Axios
- Classnames
- Normalize.css
- React
- React-dom
- React-scripts

## Dev Dependencies

- @babel/core
- @storybook/addon-actions
- @storybook/addon-backgrounds
- @storybook/addon-links
- @storybook/addons
- @storybook/react
- @testing-library/jest-dom
- @testing-library/react
- @testing-library/react-hooks
- babel-loader
- node-sass
- react-test-renderer


## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
