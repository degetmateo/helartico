export default () => {
    return `
        <style>
            .app-header {
                width: 100%;
                box-sizing:border-box;
                padding:0 15px;
                height: 50px;
                background-color: var(--bay-leaf);
                border-bottom: 1px solid var(--log-cabin);

                color: var(--heavy-metal);

                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:space-between;
            }

            .app-header .points .number {
                font-weight:bold;
            }
        </style>
    `;
};