# Text Search React

This project is a simple React app that allows users to search through articles and highlights matching keywords in titles and bodies.

## Features

- Search box with live filtering
- Case-insensitive search
- Multiple keyword support
- Highlight matches using <mark>
- Match counts displayed
- Clear search button
- Simple, clean UI

## How to Run

1. Clone the repo:
   git clone https://github.com/jadhanna99/text-search-react.git
   cd text-search-react
Install dependencies:

Copy code
npm install
Start development server:

Copy code
npm run dev
Open your browser and go to:

Copy code
http://localhost:5173/
Comments on Solution
Implemented a fully front-end React search component without any backend.

Articles are stored in a static array inside src/App.jsx.

Highlighting is case-insensitive and works with multiple words.

Input is debounced for performance.

Simple UI with a clear button, match counts, and styled highlights.

Project ready to be run locally with minimal setup.
