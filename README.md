# Github workflows

This repo is used to automate jobs using Github workflows. 


## Structure

### Projects

Create a folder for each project to house the scripts associated with them. 

### Scripts and languages
The scripts use the ethers.js library to interact with the blockchain. This repo does not currently run using truffle.

### Scheduling jobs

Each script needs to be scheduled with a .yml file saved under the .github->workflows folder. 

More documentation on scheduling jobs can be found here: [https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#scheduled-events
](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#scheduled-events)

### Saving the ABI

Save any ABI files under the abi folder. The abi folder currently contains the abi for Tellor and TellorPlayground.

### Private keys, .env and secrets

This repo contains a file named .env.example to be used as a guide to create a .env to test the scripts locally before scheduling them on the github workflows. Once your scripts run locally add secrets to the repo (do not load a .env file).

### How to add secrets

From the repo

1. Go to "Settings" on the horizontal menu bar 
2. Go to "Secrets" on the left-hand side bar
3. Click on the "New repository secret" on the top right-hand side to add secrets. 

Note: If you click "Update" on any of the existing secrets, they will appear empty. 


### Notifications
Update your notifications to be notified when jobs fail.

From the repo

1. Go to "Settings" on the horizontal menu bar 
2. Go to "Notificatons" on the left-hand side bar to update your notifications


## Running scripts manually
If the scripts fail, you will be notified. To run the scripts manually:

1. Clone the repo
2. run the commands after "- run:" in the corresponding workflow file in the order they appear.
 

Have fun automating!



step by step instructions:
Setup github workflow to tip the request id you are interested on:
1.	Fork the repo tellorutils
 https://github.com/tellor-io/tellorutils

2.	Create a copy of template.yml under .github/workflows 
3.	Name it appropriately
4.	Update the parameters in the file created on step 2.
5.	Name: this will be the name of the job and will appear as the subject on the notification email if the job fails. 
6.	Update the “schedule:” to how often and what time you need this to run. Here is a guide for the variables used for scheduling a cron job: https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#scheduled-events
7.	On line 22 replace “network” with the specific network. For example: mainnet, rinkeby, goerli, etc.
8.	On line 22 replace “reqId” to the request Id you want to tip
9.	Save your changes
10.	Commit your changes to your new repo
git add .
git commit -m “scheduled tips for request id x”
git push origin main
**Note: your changes must be pushed to the “main” branch for the workflows to execute. 
11.	Add a .env file based on the provided example to test your update locally
12.	Secrets
13.	Click on “Settings” under your repo on github 
14.	Click on “Secrets” on the left-hand side menu
15.	Click on the “New repository secret” button on the top right hand side
16.	Add all the variables in the .env file as secrets
17.	If the script fails it will send a message to the registered github email and the logs are available under “Actions” 
