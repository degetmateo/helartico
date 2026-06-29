export default () => {
    return `
        <style>
            .product {
                width: 100%;
                box-sizing:border-box;
                border-radius:5px;
                display:flex;
                flex-direction:column;
                gap:10px;

                box-sizing:border-box;
                padding:10px;
            }

            @media (min-width: 512px) {
                .product {
                    width: 512px;
                }
            }
        </style>
    `;
};