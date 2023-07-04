# Identity Reconcilation API

An API to identify and keep track of a customer's identity across multiple purchases.

To test the API visit this link https://brainy-bell-bottoms-ray.cyclic.app/api/v1/identify and navigate to [API Documentation](#api-documentation) for documentation regarding API usage.

**Please check my resume here [CV2023.pdf](CV2023.pdf)**

## Table of Contents

- [Description](#description)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Description

We know that orders on any website will always have either an **`email`** or **`phoneNumber`** in the checkout event.

One customer can have multiple Contact rows in the database against them. All of the rows are linked together with the oldest one being treated as "primary” and the rest as “secondary” . 

This API keeps track of the collected contact information in a relational database table named **`Contact`.**


## Getting Started

### Prerequisites

To run this project, you'll need to have the following requirements installed on your system:

- [Node.js](https://nodejs.org/en/download/)
- [Mysql](https://docs.mongodb.com/manual/installation/) (optional)
  - Setup Mysql Database:
  Create a database in mysql and run the following piece of code and select that database: 

``` 
create table contact(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
    phoneNumber VARCHAR(15),
    email VARCHAR(35),
    linkedId INT(11),
    linkPrecedence ENUM('secondary', 'primary') DEFAULT 'primary',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
)
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
```

### Installation

- Clone the repository to your local machine:

```
git clone git clone git@github.com:bbhupen/bitespeed-task.git
cd bitespeed-task.git
```


- Install the dependencies:

```
npm install
```
### Environment Variables

- Rename the `.env.example` file to `.env` and update the values as required:

```
MYSQL_HOST=<host>
MYSQL_USER=<username>
MYSQL_PASSWORD=<password>
MYSQL_DB=<db>
PORT=<PORT>
```


## Usage

Start the application with the following command:

- `for developement server`

```
npm run dev
```

- `for deployment server`

```
npm start
```


The server will be start listening on `http://localhost:3000`. You can access the app on your browser by visiting this URL.

## API Documentation
### Available routes

- ```/api/v1/identify```

method POST


```
// Request Body Format
{
	"email"?: string, 
	"phoneNumber"?: number 
}
```
The endpoint returns an HTTP 200 response with a JSON payload containing the required details

```
// Response Body Format

	{
		"contact":{
			"primaryContatctId": number,
			"emails": string[], // first element being email of primary contact 
			"phoneNumbers": string[], // first element being phoneNumber of primary contact
			"secondaryContactIds": number[] // Array of all Contact IDs that are "secondary" to the primary contact
		}
	}
```

Download and import the [Post Man collection](src/helpers/bitespeed.postman_collection) into Postman for easy access.

## Examples

If a customer placed an order with 
`email=lorraine@hillvalley.edu` & `phoneNumber=123456` 
and later came back to place another order with 
`email=mcfly@hillvalley.edu` & `phoneNumber=123456` ,
database will have the following rows:

```
{
	id                   1                   
  phoneNumber          "123456"
  email                "lorraine@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-01 00:00:00.374+00              
  updatedAt            2023-04-01 00:00:00.374+00              
  deletedAt            null
},
{
	id                   23                   
  phoneNumber          "123456"
  email                "mcfly@hillvalley.edu"
  linkedId             1
  linkPrecedence       "secondary"
  createdAt            2023-04-20 05:30:00.11+00              
  updatedAt            2023-04-20 05:30:00.11+00              
  deletedAt            null
}
```

### But what happens if there are no existing **contacts** against an incoming request?

The service will simply create a new `**Contact**` row with `linkPrecedence=”primary"` treating it as a new customer and return it with an empty array for `secondaryContactIds`

### When is a secondary contact created?

If an incoming request has either of `phoneNumber` or `email` common to an existing contact but contains new information, the service will create a “secondary” **`Contact`** row.

**Example:**

```
{
	id                   1                   
  phoneNumber          "123456"
  email                "lorraine@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-01 00:00:00.374+00              
  updatedAt            2023-04-01 00:00:00.374+00              
  deletedAt            null
} 
```
**Identify request:**

```
{
"email":"mcfly@hillvalley.edu",
"phoneNumber":"123456"
}
```

**New state of database:**
```
{
	id                   1                   
  phoneNumber          "123456"
  email                "lorraine@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-01 00:00:00.374+00              
  updatedAt            2023-04-01 00:00:00.374+00              
  deletedAt            null
},
{
	id                   23                   
  phoneNumber          "123456"
  email                "mcfly@hillvalley.edu"
  linkedId             1
  linkPrecedence       "secondary"
  createdAt            2023-04-20 05:30:00.11+00              
  updatedAt            2023-04-20 05:30:00.11+00              
  deletedAt            null
},
```

### Can primary contacts turn into secondary?

Yes. Let’s take an example

**Existing state of database:**

```
{
	id                   11                   
  phoneNumber          "919191"
  email                "george@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-11 00:00:00.374+00              
  updatedAt            2023-04-11 00:00:00.374+00              
  deletedAt            null
},
{
	id                   27                   
  phoneNumber          "717171"
  email                "biffsucks@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-21 05:30:00.11+00              
  updatedAt            2023-04-21 05:30:00.11+00              
  deletedAt            null
}
```

**Identify request:** 

```
{
"email":"george@hillvalley.edu",
"phoneNumber": "717171"
}
```

**New state of database:**
```
{
	id                   11                   
  phoneNumber          "919191"
  email                "george@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-11 00:00:00.374+00              
  updatedAt            2023-04-11 00:00:00.374+00              
  deletedAt            null
},
{
	id                   27                   
  phoneNumber          "717171"
  email                "biffsucks@hillvalley.edu"
  linkedId             11
  linkPrecedence       "secondary"
  createdAt            2023-04-21 05:30:00.11+00              
  updatedAt            2023-04-28 06:40:00.23+00              
  deletedAt            null
}

```

**Response:**

```
	{
		"contact":{
			"primaryContatctId": 11,
			"emails": ["george@hillvalley.edu","biffsucks@hillvalley.edu"]
			"phoneNumbers": ["919191","717171"]
			"secondaryContactIds": [27]
		}
	}
```


## Contributing

If you find any bugs, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
