export default () => {
    return `
        <style>
            .app-nav {
                box-sizing:border-box;
                width:100%;
                height:50px;

                position: absolute;
                left: 0;
                bottom: 0;
                
                display:flex;
                flex-direction:row;
                align-items:center;
                
                background-color:var(--bay-leaf);
                color:var(--heavy-metal);
                border-top:1px solid var(--heavy-metal);
            }

            .app-nav .nav-button {
                width:100%;
                height:100%;
                font-size:20px;
            
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .app-nav .nav-button:active {
                background-color: var(--log-cabin);
            }
        </style>
    `;
};