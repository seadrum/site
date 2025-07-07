
class AppCardSSOListener extends HTMLElement {
    constructor() {
        super();
        console.log('AppCardSSOListener constructor');

        //this.shadow = this.attachShadow({ mode: 'open' });

        const modeProperty = this.getAttribute('mode');
        const clientIdProperty = this.getAttribute('clientId');

        const iframeStyle = modeProperty === 'debug' ? 'display:block; width:500px; height:500px; border:1px solid black;' : 'display:none; width:0; height:0; border:0;';

        if (!clientIdProperty) {
            console.error('AppCardSSOListener: clientId attribute is required');
            this/*.shadow*/.innerHTML = `<p>Error: clientId attribute is required</p>`;
            return;
        }
        else {
            this/*.shadow*/.innerHTML = `
                <button id="login-button">Test connect event</button>
                <iframe
                    id="silent-auth-frame"
                    src="https://auth.test.appcard.com/authorize?client_id=${clientIdProperty}&response_type=code&scope=openid&state=274322b9-ea1d-459e-8c32-b4df9f513013&redirect_uri=https://seadrum.github.io/site/silent-callback.html&nonce=b2b0a38d-2e05-4944-bb47-ecb6c511eb5f"
                    style="${iframeStyle}"></iframe>
            `;
        }
    }

    connectedCallback() {
        console.log('AppCardSSOListener connected');
        const onAuthCodeReceivedHandler = this.getAttribute('onAuthCodeReceived');

        this/*.shadow*/.querySelector('button').addEventListener('click', () => {
            const code = 'abc123';
            if (onAuthCodeReceivedHandler && typeof window[onAuthCodeReceivedHandler] === 'function') {
                window[onAuthCodeReceivedHandler](code);
            }
        }, false);


        window.addEventListener("message", function (event) {
            console.log("Received message from iframe:", event.data);
 
            if (event.data.type === "OIDC_CODE") {
                const code = event.data.code;
                console.log("Received code:", event.data.code);
                if (onAuthCodeReceivedHandler && typeof window[onAuthCodeReceivedHandler] === 'function') {
                    window[onAuthCodeReceivedHandler](code);
                }
            }
    })
}
    
}

customElements.define('appcard-sso-listener', AppCardSSOListener);
