# Assignment-4

This is my fourth assignment in the Programming Hero Next Level Web Development course platform. I am very excited to share and describe my project with you.

This is a car shop management application that consists of three collections: One is user collection, another is product collection, and the other is order collection. The product collection involves creating, fetching, updating and deleting product/s operations. The order collection handles order management as well as manages generating overall revenue.

Here is the description of how I have set up my project environment, the technologies I have used, how to run and inspect the project.

## PROJECT SETUP

## Local Environment Setup

- [Git](https://git-scm.com/)
- [Node.js v22.3.0](https://nodejs.org/en/)
- [NPM 10.8.1](https://www.npmjs.com/)
- [MongoDB Driver](https://www.mongodb.com/)
- [Mongoose v8.8.2](https://mongoosejs.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Environment Variables for Local Development

> Create a .env file and adjust the following environment variables.

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.nua1k.mongodb.net/car-shop?retryWrites=true&w=majority&appName=Cluster0
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=30d
JWT_REFRESH_EXPIRES_IN=365d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=sp_sandbox
SP_PASSWORD=pyyk97hu&6u6
SP_PREFIX=SP
SP_RETURN_URL=http://localhost:5173/orders/verify

```

> Create a database in MongoDB named car-shop

## NPM SCRIPTS

```bash
$ npm install           # install dependencies
$ npm start             # development build
$ npm run start:prod    # production build
$ npm run start:dev     # start in development mode
$ npm run build         # compile typescript code into javascript
$ npm run lint          # check whether there is any potential error
$ npm run lint:fix      # fix whether there is any potential error
$ npm run prettier      # beautify the unorganized code
$ npm run prettier:fix  # prettier-fix your code
```

### VIDEO INTRO: [(Click Here)](https://drive.google.com/file/d/1L5T5PhQeanlcMOR9wukxvBLw_Eppnp3U/view?usp=sharing)
