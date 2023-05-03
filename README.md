# CIS 5500 Final Project (Group 5)
## Overview
This project was developed in Spring 2023 for CIS-5500 at the University of Pennsylvania. 

DataTune is a web application which aims to address this by providing users with new ways to discover music. Whether it be by artist ranking, song statistics, or album reviews, users can search for music in a global context. Specific attributes of music measured can be broken down by artist, album, and song. Learn about an artist's country of origin and number of listeners. Discover albums based on user reviews, critic reviews, and reception. Filter for songs based on danceability, year of release, liveliness, and more. All methods of search are made available through an interactive web page.

## Data Processing
See the DataProcessing.ipynb to see the steps taken to process the Kaggle datasets for our project.

## Set-Up
All dependencies can be found in the package.json files in the client and server directories respectively.  In order to set up the project locally, do the following:
1. Install Node.js and npm.
2. cd into both the client and server directories and run `npm install`.
3. Run `npm run start` in both client and server directories.  The site should open in localhost, port 3000.  You may need to update database login settings and set up your own tables if the original ones are no longer online.
