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

if having issues with consoloe ninja in the package.json file add a script: "start": "nodemon app.js"  ,nodemon will anable the server to  always listening respond to change.

# Database structure and relationships

this are the table(databases).
        1.  user
        2.  post
        3.  postDetails
        4.  savedPost
        5.  chat
        6.  messaget


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

and after having your router,  "express default router;"

# Building the authentification endpoint

the authentification is subivided into three endpoints
            1.  Register
            2.  Login
            3.  Logout

to enable this endpoint we must have some database functions(that performs the verification logic).

we'll create another dir (controller) it here where we'll write the function logic. and exported to router functions.

the flow structure is app.js(app.use("/api/auth", authRoute)) => auth.router.js(router.post("/Register", register)) => auth.controller.js(export const register = async (req, res) =>{})






