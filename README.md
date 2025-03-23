# Description

NOTE: this is a describtion of how to build a backend with Prisma as (ORM) and socket (for real time communication) using javascript as the language, Express.js and the database is MongoDB.

# initialize and set up the project

app.js in the main application for my backend; it is the file that is going to run the express app

initialize (install) node js to our project: npm init -y

in this code we will be using module types, not ("type": "commonjs",) so that the imports will look like this: (import a from B)

install express to the project: npm install express
This will install node_modules and package=lock.json into our application dir.

Create a .gitignore file and add nodules there

# create and start the server

on app.js import , create an express app and listen to a port

use third party libraries to anable the server to alway listen and detect any change to our code: npm install nodemon

we will console ninja and nodemon instaed of the terminal and this is how it is activate them: console-ninja node --watch app.js

if having issues with consoloe ninja in the package.json file add a script: "start": "nodemon app.js" ,nodemon will anable the server to always listening respond to change.

# Database structure and relationships

this are the table(databases). 1. user 2. post 3. postDetails 4. savedPost 5. chat 6. messaget

## RelationShips

    1.  each user can have multiple post
    2.  each post hase multiple details
    3.  a single user can save multiple post
    4.  Each post can be save multiple times
    5.  A single user can have multiple chat
    6.  inside chat we can have multiple messages

# Building endpoints

lets create our first endpoint that will return a test.

creating all the endpoint inside the app.js is untidy and can resultst to confusion therefore we'll create a different dir (routes) for the endpoint.

and inside the dir we'll create different files for different endpoint

example we'll import express and call express.Router() to create request (endpoints)

and after having your router, "express default router;"

# Building the authentification endpoint

the authentification is subivided into three endpoints 1. Register 2. Login 3. Logout

to enable this endpoint we must have some database functions(that performs the verification logic).

we'll create another dir (controller) it here where we'll write the function logic. and exported to router functions.

the flow structure is app.js(app.use("/api/auth", authRoute)) => auth.router.js(router.post("/Register", register)) => auth.controller.js(export const register = async (req, res) =>{})

## Register

for a user to be registered he must send his credentials in the request body

for the testing api we'll use postman, we'll create a collection, inside the collection we'll create a folder named auth and inside the folder well have our auth api i.e. POST register that has a json file in the request body

our server will receive the request body has json therefore we'll have to use json in our server to be able to read the json data hence inside the app.js we'll add " app.use(express.json) "

so once we have gotten the data; we'll hash the password, create a new user and save the new user to the database.

we'll have to use a library for the hashing therefore "npm install bcrypt"

1.  chaeck if we have receided the json data in the request body

2.  destructure the request body

3.  Hash the password

to hash the password we'll be using bcrypt

4.  Save the user to the database

to save the user we must have the database therefore we'll install prisma(Our ORM):

npm install prisma

    then

npx prisma init --datasource-provider mongodb

this packages will create a prisma dir and .env file

inside schema.prisma we'll write the schema

after any change schema.prisma you run: npx prisma db push

create a prisma client inside lib/prisma.js

and install prisma client: npm install @prisma/client

### what is prisma/client?
it is one of the core components of prisma orm, It abstracts away raw SQL queries or complex MongoDB queries, making it easier to work with your database.

import the PrismaClient file to the auth.controller.js

## Login
To accomplish the login funtionality we recquire the usename and password and this is gotten from the request body.

first we check if the username exist in the database

second we compare the password received and the on store in the data base by use of bcrypt.compare

now if the password and user name is correct we'll generate a cookie token and send it to the client

the browser we'll be sending the cookie in every request, to make the cookie easly understandable we must change the formart of the cookie, therfore we'll parse the cookie using the cookie-parser middleware which is an express middleware.

in short the server generates the cookie and sends it to the client; so that the client will use it to make authenticated requests. But for the server ti be able a read the cookie it must parse it(change format).

: npm install cookie-parser

import the middleware in app.js and call it(use it)


instead of using the wording "test" "myValue" to generate let use JWT (json web token)  "token" token

install the package: npm install jsonwebtoken

And create the token, using the built in function .sign() which takes the payload, secrete and options

where

    1.  Payload = user.id
    2.  Secrete = random generated strings store in the .env file(having problem with retriving the secre)



## Logout

for the logout process we'll be deleting token stored in the client.
we are sending a responce to tell the browser to delete the token stored



NOTE: To enable our front-end to make authentifaction request, we are going to use cors (Cross-Origin Resource Sharing).
      This telss the server that a specific client will be making request and to allow it to make the request.



# Test route
we are creating a test endpoint which has two routes namnely shouldbeloggedin and shouldbeadmin

## shouldbeloggedin(controller)
first we should get the token and verify the token

to verify the token we require; the token, the user credential we used to create the token(payload)
Now we'll either return if the token is valid or not

## shouldbeadmin
similar to shouldbeloggedin we first get the token, verify the token and check the payload if is admin or not



NOTE: To prevent repetition we should create a middleware for authorization and authentification.

    so middleware allows us to hijack(cut/interrapt) a process perform verification and continue the process. this is made posible by the "next()" built in functionality.

# Implimenting middleware

impimenting a middleware that will perform the verification
middlewares are not async functions.

in the recent case our middleware has performed the authentification process and said "next()" i.e. the process should continue to the controller.

To proof that the process work we have requested payload for user id and we are able to print the Id at the controllers point.


