export class TwitchService {
    #chatInputEl;
    #sendMessageButtonEl;

    constructor({ chatInputEl, sendMessageButtonEl }) {
        this.#chatInputEl = chatInputEl
        this.#sendMessageButtonEl = sendMessageButtonEl

        console.error(this.#chatInputEl, this.#sendMessageButtonEl);
    }

    sendMessage(message) {
        console.error(message)

        this.#typeMessage(message);
        this.#sendMessage();
    }

    #getReactInstance(element) {
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$')) {
                return element[key];
            }
        }

        return null;
    }

    #searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (_) {
            console.error(2, _)
        }

        if (!node || depth > maxDepth) {
            console.error(3)
            return null;
        }

        const { return: parent } = node;

        if (parent) {
            return this.#searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    #getChatInput() {
        try {
            return this.#searchReactParents(
                this.#getReactInstance(this.#chatInputEl),
                (n) => n.memoizedProps && n.memoizedProps.componentType != null && n.memoizedProps.value != null
            );
        } catch (_) {
            console.error(_)
            return null
        }
    }

    #typeMessage(message) {
        const chatInput = this.#getChatInput(this.#chatInputEl);

        if (chatInput == null) {
            return;
        }

        console.error(message)

        chatInput.memoizedProps.value = message;
        chatInput.memoizedProps.setInputValue(message);
        chatInput.memoizedProps.onValueUpdate(message);
    }

    #sendMessage() {
        this.#sendMessageButtonEl.click();
    }
}

// new TwitchService().sendMessage('ttt')

// function getReactInstance(element) {
//     for (const key in element) {
//         if (key.startsWith('__reactInternalInstance$')) {
//             return element[key];
//         }
//     }
//
//     return null;
// }
//
// function searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
//     try {
//         if (predicate(node)) {
//             return node;
//         }
//     } catch (_) {
//     }
//
//     if (!node || depth > maxDepth) {
//         return null;
//     }
//
//     const { return: parent } = node;
//     if (parent) {
//         return searchReactParents(parent, predicate, maxDepth, depth + 1);
//     }
//
//     return null;
// }
//
// function getChatInput(element = null) {
//     let chatInput;
//     try {
//         chatInput = searchReactParents(
//             getReactInstance(element || document.querySelector(CHAT_INPUT)),
//             (n) => n.memoizedProps && n.memoizedProps.componentType != null && n.memoizedProps.value != null
//         );
//     } catch (_) {}
//
//     return chatInput;
// }
//
// function setChatInputValue(text, shouldFocus = true) {
//     const element = document.querySelector(CHAT_INPUT);
//     const chatInput = getChatInput(element);
//
//     if (chatInput == null) {
//         return;
//     }
//
//     chatInput.memoizedProps.value = text;
//     chatInput.memoizedProps.setInputValue(text);
//     chatInput.memoizedProps.onValueUpdate(text);
// }
//
// function sendMessage() {
//     document.querySelector(SEND_BUTTON_SELECTOR).click();
// }

// function getTime() {
//     const d = new Date()
//     const f = (n) => n < 10 ? '0' + n : n;
//
//     return `${f(d.getHours())}:${f(d.getMinutes())}:${f(d.getSeconds())}`
// }
//
// function p() {
//     console.clear();
//
//     const commands = ['!hitsquad', '!battleroyale', '!gauntlet'];
//
//     const id = setInterval(() => {
//         const command = commands.shift();
//
//         if (command) {
//             setChatInputValue(command);
//             sendMessage();
//             console.error('Sent: ', command + ' | ' + getTime());
//         } else {
//             clearInterval(id);
//         }
//     }, 2000);
// }


export const send = (message) => {
    const CHAT_INPUT = 'textarea[data-a-target="chat-input"], div[data-a-target="chat-input"]';
    const SEND_BUTTON_SELECTOR = '[data-a-target="chat-send-button"]';

    function getReactInstance(element) {
        console.error(Object.keys(element))

        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$')) {
                console.error(key)
                return element[key];
            }
        }

        return null;
    }

    function searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (_) {
        }

        if (!node || depth > maxDepth) {
            return null;
        }

        const { return: parent } = node;
        if (parent) {
            return searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    function getChatInput(element = null) {
        let chatInput;
        try {
            chatInput = searchReactParents(
                getReactInstance(element || document.querySelector(CHAT_INPUT)),
                (n) => n.memoizedProps && n.memoizedProps.componentType != null && n.memoizedProps.value != null
            );
        } catch (_) {}

        return chatInput;
    }

    function setChatInputValue(text, shouldFocus = true) {
        const element = document.querySelector(CHAT_INPUT);

        console.error(element)

        const chatInput = getChatInput(element);

        console.error(222, chatInput)

        if (chatInput == null) {
            return;
        }

        chatInput.memoizedProps.value = text;
        chatInput.memoizedProps.setInputValue(text);
        chatInput.memoizedProps.onValueUpdate(text);
    }

    function sendMessage() {
        document.querySelector(SEND_BUTTON_SELECTOR).click();
    }

    setChatInputValue(message);
    sendMessage();
}
