# Ollama Web Interface

### Description
This project is for running Ollama locally and having a simple web interface instead of the command line. While products like ChatGPT, LLaMA, DeepSeek, etc are great and run well in the cloud, sometimes you just want to own your data keep it close by. This allows you to have an LLM at your disposal, though obviously it comes with the limitations of hardware and models not being 100% up-to-date.

### How to Run
You will need Node/npm/npx/etx to run this project, as well as Ollama installed and serving (run `ollama serve` before running the app). The current configuration is going to run llama3.2, but you can go into the `server.js` file in the backend and change the model to anything Ollama supports:
1) Clone the repo and cd into the `/ollamaWeb/ollamaWebApi` directory. Run `node server.js` to start the backend on localhost:5000
2) cd into `/ollamaWeb/ollamawebui`. Run `npm run dev` to start the frontend on localhost:3000.
3) Ask your questions and enjoy!

You can use any kind of reverse proxy if you run this on a server and want to access it on the rest of your network but I would like to put in a small plug for [Tailscale](https://tailscale.com/). Install it on all of your machines for a safe local network, then you can expose your chat app to any device connected to your tailnet. I use it for all of my home lab needs!
