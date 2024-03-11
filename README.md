# Gitlab-Issue-Tracker-Oauth

## Functionality:
- The user can track all of their GitLab projects.
- The user can see issue state changes in real time (and change) the issue state.
- The user can see issue labels changes in real time (and change) the issue labels.
- The user can see issue emoji changes in real time (and change) the issue emojis.
- The user can see issue description changes in real time (and change) the issue description.
- The user is authorized through O AUTH and can see their own issues.
- Security is implemented wherever is needed (authorization, routes, session).
- All sensitive information is dynamically stored in process.env .
- MVC pattern is followed.

## Installing:
- The client side part doesn't need any installations.
- The server side uses several npm modules. Node and npm must be installed on the server for the code to run. 
- The needed node modules are included in the `package.json` file, so the only thing you need to do is to open the terminal (inside the project folder) and run the command `npm install`
- Grading: I'm using eslint, however, in `package.json` is declared that i'm using a devDependency called `"@lnu/eslint-config": "^1.1.10"`. I extend it in `.eslintrc.cjs` so that the project can enforce the linting rules.
- I use ES6 modules imports (`"type":"module"` in `package.json`).

## Starting & configuring:
- On the server, I use `pm2 start npm --name "assignment:5052" -- start` to keep the application running on the server.
- The command automatically runs the `"start": "NODE_ENV=development PORT=5052 node app.js"` npm command.
- In case pm2 is not installed on the server, you can run `"start": "NODE_ENV=development PORT=5052 node app.js"`. This will make the website accessible too.
- When the server is running, you only need to access the webpage via https://cscloud6-120.lnu.se/assignment/
- You need a gitlab.lnu.se account

- Other than using HTTPS I use the following configuration on the server:

>location /assignment/ {
    proxy_pass http://localhost:5052/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
}

## Video:

[https://youtu.be/wJsl_fdP15A]