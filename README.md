# Aot-Backend

## To run server
  - add ```.env.local``` file in ```./src/config``` (from discord)
  - open terminal
  - run ```npm i``` (only at the first setup)
  - run ```npm run server```

## Project architecture documentation
  - ```./src/config``` : contains configuration files that define settings and parameters used by the application. Configuration files may include database connection settings, environment variables, logging configuration, etc.
  - ```./src/config/.env.local``` : credentials file.
  - ```./src/routes``` : contains route files that define the endpoints and route handlers for the application. Each route file may define routes for specific resources or functionalities and delegate the request handling to corresponding controller functions.
  - ```./src/controllers``` : contains controller files responsible for handling incoming requests, processing data, and sending responses back to the client. Each controller file may contain functions corresponding to different routes or endpoints.
  - ```./src/services``` : contains service files that encapsulate business logic and interact with models to perform operations on the data. Services abstract away the complexity of data manipulation from the controllers and provide a clean separation of concerns.
  - ```./src/models``` : contains model files that define the structure of data entities used in the application. Models represent the data stored in the database and often provide methods for interacting with the database.
  - ```./src/utils``` : contains utility files that contain reusable functions or helper methods used throughout the application. Utilities can include functions for validation, formatting, error handling, etc.

demo