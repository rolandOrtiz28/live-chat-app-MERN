
Hi there!

Here are the instructions on how to run the client-side and server-side files:

Client-side:

1.Open your terminal and navigate to the "clientside" directory.
2.Run 'npm install --save-dev vite --legacy-peer-deps'.
2.Run the command "npm run dev" in the root directory of the clientside.
3.Paste the following URL in your browser to see the app: http://localhost:5173/

Server-side:

1.Open your terminal and navigate to the "serverside" directory.
2.Run the command "nodemon start" in the root directory of the serverside.
3.To test the live chat functionality, you can create your own account and then open a new browser to log in as a guest.

Enjoy chatting!

Features:

Simple CRUD operations
Login and Register functionality
Search contacts
Profile modal
Live notifications
Loading function
Live chat
Group chat
Work in progress:

Updating profile functionality
Emojis integration

you can add an .env file in the root file of the serverside then add this environment variables:
JWT_SECRET=rolandortiz

DB_URL=mongodb+srv://rolandWeb:rolandortiz281995@rpocluster.3gsyr5o.mongodb.net/?retryWrites=true&w=majority

CLOUDINARY_CLOUD_NAME=dbzuuuvue
CLOUDINARY_KEY=521197497123861
CLOUDINARY_SECRET=w_-29hP6MzdLZLI8yN3f9nF3otw


SECRET=chat-app
