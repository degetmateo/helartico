export default () => {
    return `
        <style>
            .product {
                width: 100%;
                padding:10px;
                box-sizing:border-box;
                border: 2px solid var(--color-main-darker);
                border-radius:5px;
                display:flex;
                flex-direction:column;
                gap:10px;
            }

            .product .button {
                padding:10px;
                border:none;
                outline:none;
                color:#FFF;
                font-size: 18px;
                font-weight:bolder;
                border-radius:5px;
                background: #1D3557;
            }

            .product .name {
                font-size: 18px;
                font-weight:bolder;
            }

            @media (min-width: 512px) {
                .product {
                    width: 512px;
                }
            }
        </style>
    `;
};