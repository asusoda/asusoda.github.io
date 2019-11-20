# thesoda.io
### The Software Developers Association

This is the directory for SoDA's current React.js static website.

## How to run website locally
The website uses npm, which manages all dependencies and has a dummy server that you can run on your local machine to view the website.
```
cd /website2018
npm i #install all dependencies if this is the first time you are doing this
npm start
```

## Pushing changes
Always make sure you pull before working on the repository.
Since the website is a react application, uses many dependencies, and is written in ES6, you will have to use many tools to transpile bundel. Fortunately, npm has scripts that does that and puts all the code in `../website2018/build`. When you are done writing code and want to get the final build:
```
cd /website2018
npm run-script build
```
Then, you have to copy all the files and folders from `../website2018/build` to `../`.
Then, you can push all your changes.

# React.js Documentation

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the React.js guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).