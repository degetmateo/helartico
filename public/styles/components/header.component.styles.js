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

            .app-header .app-header-left {
                display:flex;
                flex-direction:row;
                gap:10px;
                align-items:center;
                justify-content:flex-start;
            }

            .app-header .app-header-right {
                display:flex;
                flex-direction:row;
                gap:10px;
                align-items:center;
                justify-content:flex-end;
            }

            .app-header .app-header-icon {
                font-size: 20px;
            }

            .app-header .app-header-icon.reload {
                font-size: 14px;
                color: var(--bay-leaf);
                background-color: var(--heavy-metal);
                padding:4px;
                border-radius:50%;
            }

            .app-header .points .number {
                font-weight:bold;
            }
        </style>
    `;
};