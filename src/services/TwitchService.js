import { config } from '../consts/config';

export class TwitchService {
    _chatInputEl;
    _sendMessageButtonEl;

    constructor({ chatInputEl, sendMessageButtonEl }) {
        this._chatInputEl = chatInputEl;
        this._sendMessageButtonEl = sendMessageButtonEl;
    }

    sendMessage(message) {
        if (!config.allowMessages) {
            return;
        }

        try {
            this._typeMessage(message);
            this._sendMessage();
        } catch (e) {
            console.error(e);
        }
    }

    _getReactInstance(element) {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$')) {
                return element[key];
            }
        }

        return null;
    }

    _searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (e) {
            console.error(e);
        }

        if (!node || depth > maxDepth) {
            return null;
        }

        const { return: parent } = node;

        if (parent) {
            return this._searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    _getChatInput() {
        try {
            return this._searchReactParents(
                this._getReactInstance(this._chatInputEl),
                (n) => n.memoizedProps && n.memoizedProps.componentType != null && n.memoizedProps.value != null
            );
        } catch (_) {
            console.error(_);
            return null;
        }
    }

    _typeMessage(message) {
        const chatInput = this._getChatInput(this._chatInputEl);

        if (chatInput == null) {
            return;
        }

        chatInput.memoizedProps.value = message;
        chatInput.memoizedProps.setInputValue(message);
        chatInput.memoizedProps.onValueUpdate(message);
    }

    _sendMessage() {
        this._sendMessageButtonEl.click();
    }
}
