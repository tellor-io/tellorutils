# Github workflows

This repo is used to automate jobs using Github workflows. 


## Structure

### Projects

Create a folder for each project to house the scripts associated with them. For example, all the scripts associated with AMPL's automated processes are in the AMPL folder. 

### Scripts and languages
The scripts use the ethers.js library to interact with the blockchain. This repo does not currently run using truffle.

### Scheduling jobs

Each script needs to be scheduled with a .yml file saved under the .github->workflows folder. 

More documentation on scheduling jobs can be found here: [https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#scheduled-events
](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#scheduled-events)

### Saving the ABI

Save any ABI files under the abi folder. 

### Private keys, .env and secrets

This repo contains a file named .env.example to be used as a guide to create a .env to test the scripts locally before scheduling them on the github workflows. Once your scripts run locally add secrets to the repo (do not load a .env file).

### How to add secrets

From the repo

1. Go to "Settings" on the horizontal menu bar 
2. Go to "Secrets" on the left-hand side bar
3. Click on the "New repository secret" on the top right-hand side to add secrets. 

Note: If you click "Update" on any of the existing secrets, they will appear empty. 


### Do Not change the secrets associated with this repo

Don't change secrets associated with this repo, or scripts currently running can break if they do not hold the ETH, TRB or Matic tokens needed to run transactions. 


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