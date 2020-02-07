# Figuring out the OpenFn runtime

## Setup

1. Install the *OpenFn* [`devtools`](https://github.com/OpenFn/openfn-devtools):
    ```sh
    npm install -g github:openfn/core#v1.0.0
    ```

1. Install the *OpenFn* [`language-http`](https://github.com/OpenFn/language-http) pack: 
    ```sh
    git clone https://github.com/OpenFn/language-http.git && cd language-http && npm i && cd ..
    ```
    This will install `language-common` as a dependency.

## Run the demo

1. `cd learning`
2. Serve the `a.json` file as an example remote API - e.g. using `npx serve`.
2. Run: 
    ```sh
    core execute -l ./language-http.Adaptor -s ./state-input.json -o ./state-output.json -e fn.js
    ```


## Note
Can also watch: 
```sh
nodemon -i "*.json" --exec "core execute -l ./language-http.Adaptor -s ./state-input.json -o ./state-output.json -e fn.js; bat state-output.json"
```
