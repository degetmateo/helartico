export default () => {
    return `
        <style>
            .app-code {
                display:flex;
                width:100%;
                padding:10px;
                box-sizing:border-box;
                flex-direction:row;
                gap:10px;
                align-items:center;
                justify-content:space-between;

                border-bottom: 1px solid var(--log-cabin);
            }

            .app-code .code {
                font-size: 20px;
                font-weight: bolder;
                letter-spacing: 2px;
            }

            // .app-code .status {
            
            // }
        </style>
    `;
};