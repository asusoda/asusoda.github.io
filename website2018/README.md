# thesoda.io
### The Software Developers Association

This is the directory for SoDA's current React.js static website.

## How to run website locally
The website uses npm, which manages all dependencies and has a dummy server that you can run on your local machine to view the website.
```shell
> cd ./website2018
> npm i #install all dependencies if this is the first time you are doing this
> npm start
```

The server will refresh the page automatically when you make changes to the code!

## Adding new events

All new events are added to
[`./website2018/src/assets/events.json`](./src/assets/events.json). Copy and
edit a previous event to create a new one.

## Pushing changes

Always make sure you pull before working on the repository. Since the website is
a react application, uses many dependencies, and is written in ES6, you will
have to use many tools to transpile the code. Fortunately, npm has scripts that
does that and puts all the code in `./website2018/build`. When you are done
writing code and want to get the final build:

```shell
> cd /website2018
> npm run-script build
```

Then, you have to copy all the files and folders from `./website2018/build` to
`./` (the root of the repository). Then, you can push all your changes.

# Helpful Documentation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the React.js guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

We use [Semantic UI React](https://react.semantic-ui.com) for user interface
components.
