
class AppCardSSOListener extends HTMLElement {
    constructor() {
        super();
        console.log('AppCardSSOListener constructor');

//        this.shadow = this.attachShadow({ mode: 'open' });

        const modeProperty = this.getAttribute('mode');
        const iframeStyle = modeProperty === 'debug' ? 'display:none; width:0; height:0; border:0;' : 'display:block; width:500px; height:500px; border:1px solid black;';

        this/*.shadow*/.innerHTML = `
            <script>
                console.log('Setting up iframe listener');
                var code = null;
                window.addEventListener("message", function (event) {
                console.log("Received message from iframe:", event.data);
                console.log("Received message type from iframe:", event.data.type);
                if (event.data.type === "OIDC_CODE") {
                    code = event.data.code;
                    document.getElementById("status").innerText = "Received code: " + code;
                }
            </script>

            <button id="login-button">test</button>
            <iframe
                id="silent-auth-frame"
                src="https://auth.test.appcard.com/authorize?client_id=m2m-client-test-4f155389-ec66-4ccc-a739-bae6c4fc2d2a&response_type=code&scope=openid&state=274322b9-ea1d-459e-8c32-b4df9f513013&redirect_uri=https://seadrum.github.io/site/silent-callback.html&nonce=b2b0a38d-2e05-4944-bb47-ecb6c511eb5f"
                style="${iframeStyle}"></iframe>
        


        `;
    }



    connectedCallback() {
        console.log('AppCardSSOListener connected');
        this/*.shadow*/.querySelector('button').addEventListener('click', () => {
        const code = 'abc123';

        // Handle onAuthCodeReceived attribute
        const onAuthCodeReceivedHandler = this.getAttribute('onAuthCodeReceived');

        if (onAuthCodeReceivedHandler && typeof window[onAuthCodeReceivedHandler] === 'function') {
            window[onAuthCodeReceivedHandler](code); // Call the function by name from global scope
        }

        /*
        // (Optional) also dispatch real DOM event
        this.dispatchEvent(new CustomEvent('authCodeReceived', {
            code,
            bubbles: true,
            composed: true,
        }));
        */
    })
}
    
}

customElements.define('appcard-sso-listener', AppCardSSOListener);
