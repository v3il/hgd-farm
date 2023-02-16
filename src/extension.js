import './style.css'

import { config } from './config';
import { TwitchService, StreamService } from "./services";

const intervalId = setInterval(() => {
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    if (playerEl && chatInputEl && sendMessageButtonEl) {
        clearInterval(intervalId);
        runApp()
    }
}, 1000);

function runApp() {
    const containerEl = mountAppContainer();
    const { playerEl, chatInputEl, sendMessageButtonEl } = getElements();

    const twitchService = new TwitchService({ chatInputEl, sendMessageButtonEl });
    const streamService = new StreamService({ containerEl, playerEl });

    setInterval(() => {
        processRound({ twitchService, streamService });
    }, config.intervalBetweenRounds);

    processRound({ twitchService, streamService });
}

async function processRound({ twitchService, streamService }) {
    const isBanPhase = await streamService.isBanPhase();

    if (!isBanPhase) {
        sendMessage(twitchService, config.commands);
    }

    console.error('Is ban', isBanPhase);
}

function sendMessage(twitchService, messages) {
    const delay = config.intervalBetweenCommands + Math.random() * 1000 + 500;
    const message = messages.shift();

    setTimeout(() => {
        twitchService.sendMessage(message);

        if (messages.length) {
            sendMessage(twitchService, messages);
        }
    }, delay)
}

function mountAppContainer() {
    const containerEl = document.createElement('div');
    containerEl.classList.add('haf-container');
    document.body.appendChild(containerEl);
    return containerEl;
}

function getElements() {
    const playerEl = document.querySelector(".persistent-player");
    const chatInputEl = document.querySelector('[data-a-target="chat-input"]');
    const sendMessageButtonEl = document.querySelector('[data-a-target="chat-send-button"]');

    return { playerEl, chatInputEl, sendMessageButtonEl };
}
