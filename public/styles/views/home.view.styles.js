export default () => {
    return `
        <style>
            .home {
                width: 100dvw;
                height: 100dvh;

                display:flex;
                flex-direction:column;

                align-items:center;

                overflow-y:auto;
            }

            .home .header {
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

                position: absolute;
                top: 0;
                left: 0;

                z-index:1;
            }

            .home .header .points .number {
                font-weight:bold;
            }

            .home .header .left {
                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:flex-start;
                gap:10px;
            }
            
            .home .header .signout {
                font-size: 18px;
                padding:4px;
                border-radius:5px;
                border:2px solid var(--log-cabin);
            }

            .home .main {
                position:relative;
                top:50px;
                display:flex;
                flex-direction:column;

                width:100%;
            }

            .home .main .form {
                padding:10px;

                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:center;
                gap:10px;
                // border-bottom:1px solid var(--color-hover);
            }

            .home .main .products {
                display: flex;
                flex-direction: column;
                align-items:center;
                // gap:20px;
            }
        </style>
    `;
};