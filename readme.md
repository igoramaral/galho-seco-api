<a id="readme-top"></a>

# :game_die: Galho Seco - A D&D Character Sheet Manager

![GitHub top language](https://img.shields.io/github/languages/top/igoramaral/galho_seco)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/igoramaral/galho_seco/workflow.yaml)
[![Author](https://img.shields.io/badge/Author-Igor%20Amaral-blue)](https://github.com/igoramaral)

Galho Seco is a D&D character sheet manager that runs on mobile devices and allows user to integrate rolls to Foundry VTT.
This project is part of the final project for the Computer and Information Engineering degree at Federal University of Rio de Janeiro (UFRJ)


## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Built with](#built-with)
- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [License](#license)
- [Author](#author)

## About the Project

The goal of this project is to build an API capable of supporting the functionalities of Galho Seco, a D&D character sheet manager app for mobile devices.

Galho Seco will allow users to create, edit and rolls tests on their D&D character sheet wherever and whenever they want.

One of the main goals of this project is to integrate the app with [Foundry VTT](https://foundryvtt.com) to allow players to roll tests for their characters without the need of being connected to Foundry VTT.

## Built with

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## Installation

### Option 1: Running the Project with the Source Code

If you want to run the project with the source code, follow these steps:

#### 1) Clone the repo:
```sh
git clone https://github.com/igoramaral/galho_seco.git
cd galho_seco
```

#### 2) Install dependecies:
```sh
npm install
```

#### 3) Set up MongoDB for testing:

Ensure you have a MongoDB instance running for the application. You can use a local MongoDB server or a cloud service like MongoDB Atlas.
Create a database to be used for testing purposes.

#### 4) Create a .env file in the root directory of the project with the following variables:
```
PORT=<THE PORT YOU WANT TO USE>
dbURL=<URL FOR CONNECTING TO THE MONGODB DATABASE>
JWT_SECRET=<ANY STRING FOR CREATING TOKENS>
```

#### 5) Run the project:
```sh
npm start
```

### Option 2: Runing the project with Docker

If you prefer to run the project via Docker, follow these steps:

#### 1) Pull the Docker image from Docker Hub:

```sh
docker pull igormaram/galho-seco-api
```

#### 2) Set up MongoDB for testing:

Ensure you have a MongoDB instance running for the application. You can use a local MongoDB server or a cloud service like MongoDB Atlas.
Create a database to be used for testing purposes.

#### 3) Create a .env file in the root directory of the project with the following variables:
```
PORT=<THE PORT YOU WANT TO USE>
dbURL=<URL FOR CONNECTING TO THE MONGODB DATABASE>
JWT_SECRET=<ANY STRING FOR CREATING TOKENS>
```
#### 4) Run the docker container:
```sh
docker run -p 3000:3000 --env-file .env igoramaral/galho-seco-api
```

## Usage

The API provides several endpoints for managing users and characters.  
All available routes, request formats, and responses are documented using Swagger.  

To access the API documentation, start the project and navigate to:  

📌 **[Swagger UI - API Docs](http://localhost:3000/api/docs)**  

This page provides an interactive interface to explore and test the API endpoints.

## Running Tests

to run unit tests, you can run:
```sh
npm test
```

## License

Licensed under ISC license. 

## Author

**Igor Dominices Baía do Amaral**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/igoramaral)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/igor-db-amaral/)

