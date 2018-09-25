This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
See the [bootstrapped README](create-react-app-README.md) for more info.

## Table of Contents
* TODO: [Open source](#open-source)
* [Installation](#installation)
* [Develop](#develop)
* [Environments](#environments)
* [Build](#build)
* [Deploy](#deploy)
* TODO: [Updating Data](#updating-data)

## Installation
```
git clone https://github.com/pmlord/legislative-scorecard.git
cd legislative-scorecard
yarn install
```

#### A note on [Yarn](https://yarnpkg.com/)
`yarn` is a drop-in replacement for `npm`, and is what you’ll see documented throughout this README. You can install it with `npm`
```
npm install --global yarn
```
or [see their documentation](https://yarnpkg.com/en/docs/install) for alternatives such as [Homebrew](https://brew.sh/) and [MacPorts](https://www.macports.org/).

## Develop
```
yarn start
```
The dev server will run on http://localhost:3000

#### HTTPS
```
HTTPS=true yarn start
```


## Environments

Within the source code, you can refer to `process.env.REACT_APP_ENV` for the current environment. The value may be 'development', 'staging', and 'production'. These are set with `yarn start`, `yarn build:staging`, and `yarn build:production`, respectively.

This is an extension of [create-react-app's NODE_ENV](/create-react-app-README.md#adding-custom-environment-variables). `process.env.NODE_ENV` is still available, but process.env.REACT_APP_ENV should be used instead.

## Build

```sh
yarn build:staging
yarn build:production
yarn build  # alias for build:production
```

## Deploy

Hosted on AWS with S3, CloudFront, and Route-53.

To deploy, you'll need to install the [AWS-CLI](https://aws.amazon.com/cli/) and have the appropriate [AWS credentials configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

#### Deploy whatever's in the `/build/` directory:

```sh
yarn deploy:staging     # http://
yarn deploy:production  # http://
yarn deploy             # alias for deploy:production
```

#### Build & deploy:

```sh
yarn build:deploy:staging     # http
yarn build:deploy:production  # http
```
