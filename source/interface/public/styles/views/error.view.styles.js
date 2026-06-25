export default () => {
    return `
        <style>
            .error-view {
                width: 100%;
                height: 100%;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .error-container {
                display:flex;
                flex-direction:column;
                gap:10px;
                padding:10px;
                align-items:center;
                justify-content:center;
            }

            .error-view-title {
                font-weight:bolder;
                font-size:64px;
            }

            .error-view-message {
                text-align:center;
            }
        </style>
    `;
};