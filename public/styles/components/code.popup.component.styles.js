export default () => {
    return `
        <style>
            .app-code-popup {
                position: absolute;
                top:0;
                left:0;
                width: 100%;
                height: 100%;

                display:flex;
                align-items:center;
                justify-content:center;
                z-index:1;

                padding:10px;
                box-sizing:border-box;

                background-color: #00000082;
            }

            .app-code-popup .code-container {
                display:flex;
                gap:10px;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                padding:10px;
                border-radius:5px;
                background-color:var(--bay-leaf);
                text-align:center;
                border:1px solid var(--log-cabin);
                max-width: 512px;
            }

            .app-code-popup .code-container .code {
                font-size:32px;
                letter-spacing: 2px;
            }
        </style>
    `;
};