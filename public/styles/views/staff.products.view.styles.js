export default () => {
    return `
        <style>
            .staff-products-view .main {
                padding-top: 50px;
                padding-bottom: 50px;
                box-sizing:border-box;
                height:100%;
                overflow-y:scroll;
            }

            .staff-products-view .main .container {
                display:flex;
                flex-direction:column;
            }

            .staff-products-view .main .form {
                display:flex;
                flex-direction:row;
                align-items:center;
                gap:10px;
                box-sizing:border-box;
                padding:10px;
                border-bottom:1px solid var(--log-cabin);
            }

            .staff-products-view .main .form .input {
                width: 100%;
            }

            .staff-products-view .products {
                display:flex;
                flex-direction:column;
            }

            .staff-products-view .products .product {
                width:100%;
                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:space-between;
                gap:10px;
                border-radius:0;

                border-bottom: 1px solid var(--log-cabin);
            }

            .staff-products-view .product .name {
                font-size: 18px;
                font-weight: bolder;
                color: var(--heavy-metal);
            }

            .staff-products-view .button-container {
                width:100%;
                box-sizing:border-box;
                display:flex;
                flex-direction:column;
                padding:10px;
            }
        </style>
    `;
};