export default () => {
    return `
        <style>
            .app-pwa {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-sizing:border-box;

                display:flex;
                align-items:center;
                justify-content:center;
                padding:10px;

                z-index:1;
                background-color: #00000082;
            }

            .app-pwa .pwa-content {
                display:flex;
                flex-direction:column;
                gap:10px;
                padding: 10px;
                border-radius:5px;
                background-color: var(--bay-leaf);
                max-width: 512px;
                border: 1px solid var(--log-cabin);
                box-sizing:border-box;
            }

            .app-pwa .pwa-content .pwa-icon {
                width:100%;
                max-width: 512px;
            }

            .app-pwa .pwa-content .pwa-text {
                display:flex;
                flex-direction:column;
                gap:10px;
                font-size:20px;
            }

            .app-pwa .pwa-content .pwa-buttons {
                display:flex;
                flex-direction:row;
                gap:10px;
            }

            .app-pwa .pwa-content .pwa-button {
                width:100%;
            }
        </style>
    `;
};