export default () => {
    return `
        <style>
            .landing-view {
                width:100%;
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .landing-container {
                display:flex;
                flex-direction:column;
                gap:10px;
                padding:10px;
            }

            .landing-logo {
                max-width: 100%;
                border-radius: 10px;
                border: 1px solid var(--color-main-darker);
            }

            .landing-view .message {
                color: var(--log-cabin);
            }

            @media (min-width: 512px) {
                .landing-container {
                    width: 512px;
                }
            }
        </style>
    `;
};