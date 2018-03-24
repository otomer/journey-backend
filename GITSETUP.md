# Working with Github/Node/Mongodb

## Prerequisites
#### Node:
Download & Install node from: https://nodejs.org/en/download/ (Choose LTS Version)
#### Git: 
Download & Install git from: https://git-scm.com/downloads (Simple next-next installation) To check if you already have it, open cmd.exe and run git.
#### Visual Studio Code / Or use your favorite IDE
You can Download VSCode from https://code.visualstudio.com/download 

## Preparing the Repository on your local drive
* Open cmd.exe, and navigate to c:\ or your favorite code folder
* Run git clone https://github.com/otomer/journey-backend.git
* You should have now c:\journey-backend folder
* Navigate to the above folder, and run
```
npm install
```

## Do Your first commit
* Open Visual Studio Code
* Open the project folder via (File → Open Folder C:\journey-backend)
* Edit the README.md file (on your left file explorer view) and add your name to the team members list
* Save the file (CTRL+S)
* Open Terminal window (View → Integrated Terminal)
* Run the following commands via Terminal
```
git add .
git commit -m "Adding myself to team list"
git push
```
* Open your browser in: https://github.com/otomer/journey-backend and verify you do see your change.

# Database 
## Robo3T (Database management & viewer tool)
Download from https://robomongo.org/download

### Add new database: 
#### Connection settings:
* Name: journey-db
* Address: ds223019.mlab.com
* Port: 23019
#### Authentication tab:
* Db name: journey-db
* User: jadmin
* Pass: jadmin
* Press Test (It should be all green) and then Save.
* Select the created connection and you can now view the database
 
