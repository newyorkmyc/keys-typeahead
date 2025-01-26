# Fungal Keys Typahead
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Aggregating links to fungal keys for the NYMS website.

## How to contribute to the website
To contribute any fungal keys please enter them on our  [Google Sheets Here](https://docs.google.com/spreadsheets/d/1pPqUs63co3WlyIGs16FznQdhtlXdJ8g2nJSt_N5fmIE/edit?gid=0#gid=0)

You will only have access to the `Enter Data Here` sheet. After you are done entering your data, open a [New Issue](https://github.com/newyorkmyc/keys-typeahead/issues) here on github and choose the 'Request Key Review' from the template option. Please populate the template and someone from the NYMS team will review and merge the data in.

Here is an overview of the columns
| Column Header 	| Description                                                                        	| Input type 	| Data Rule 	|
|---------------	|------------------------------------------------------------------------------------	|------------	|-----------	|
| inat_taxon    	| Name as seen on inaturalist.org                                                    	| string     	|           	|
| Title         	| Title of the paper, website and or key to species                                  	| string     	|           	|
| locale        	| What part of the world, this key covers                                            	| string     	|           	|
| authors       	| Name of the author(s) who wrote the key                                            	| string     	|           	|
| url           	| Link to the key                                                                    	| url        	| url       	|
| language      	| Language the key appears in using a 2 letter country code. (e.g. `en` for English) 	| string     	| 2 letters 	|
| type          	| Dropdown to select the type of key, .pdf, .doc, url, paper or other                	| dropdown   	| 1 choice  	|
| country code  	| 2 letter country code                                                              	| string     	| 2 letters 	|
| country       	| Country name                                                                       	| string     	|           	|


## Getting Started

These instructions will help you clone a copy of the project, and get it up and running on
your local machine for development and testing purposes.

(_See deployment
for notes on deploying the project on a live system._)

### Prerequisites

Requirements for the software and other tools to build, test and push
- [node.js](https://nodejs.org/en/download/package-manager)
- [http-server](https://www.npmjs.com/package/http-server)

### Installing

A step by step installation guide

1. Download or pull the repo into your local computer
   1. `git clone https://github.com/newyorkmyc/keys-typeahead.git`
1. Navigate to the repo folder location on your local computer and install the npm packages
   1. `npm install`
1. Navigate to the folder location in the command line and start a node server with:
   1.`npm install --global http-server`
1. To start the server run the following command:
   1. `npx http-server`
1. Visit your browser at http://localhost:8080/ to see the UI

### Current UI Design

![image](https://github.com/user-attachments/assets/31d4578e-fbe9-44a8-a9b0-2dec9cce8548)

### How to use the search

- The search bar will return any matches in the database.
- Clear selection button will remove any typed in characters.
- The results box will display a scrollable list of keys.
- The random key button will randomly pick out a key to expore.
- The iNat buttons send you to iNaturalist.org with the current typed in genus searched, with or without an ITS DNA Barcode.

## Deployment

Add additional notes to deploy this on a live system

## Built With

  - Google Sheets for initial data collection
  - Python 3+ for converting data into JSON
  - HTML / CSS / JavaScript


## License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Elaniobro"><img src="https://avatars.githubusercontent.com/u/710847?v=4?s=100" width="100px;" alt="Elan Trybuch"/><br /><sub><b>Elan Trybuch</b></sub></a><br /><a href="https://github.com/newyorkmyc/keys-typeahead/commits?author=Elaniobro" title="Documentation">📖</a> <a href="https://github.com/newyorkmyc/keys-typeahead/commits?author=Elaniobro" title="Code">💻</a> <a href="#infra-Elaniobro" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#tool-Elaniobro" title="Tools">🔧</a> <a href="#question-Elaniobro" title="Answering Questions">💬</a> <a href="#mentoring-Elaniobro" title="Mentoring">🧑‍🏫</a> <a href="#ideas-Elaniobro" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-Elaniobro" title="Maintenance">🚧</a> <a href="#plugin-Elaniobro" title="Plugin/utility libraries">🔌</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mrozanoff/mrozanoff.github.io"><img src="https://avatars.githubusercontent.com/u/48360019?v=4?s=100" width="100px;" alt="Matthew Rozanoff"/><br /><sub><b>Matthew Rozanoff</b></sub></a><br /><a href="https://github.com/newyorkmyc/keys-typeahead/commits?author=mrozanoff" title="Code">💻</a> <a href="https://github.com/newyorkmyc/keys-typeahead/commits?author=mrozanoff" title="Documentation">📖</a> <a href="https://github.com/newyorkmyc/keys-typeahead/issues?q=author%3Amrozanoff" title="Bug reports">🐛</a> <a href="#data-mrozanoff" title="Data">🔣</a> <a href="#question-mrozanoff" title="Answering Questions">💬</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
