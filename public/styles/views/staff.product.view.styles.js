export default () => {
    return `
        <style>
            .staff-product-view .main {
                padding-top: 50px;
                padding-bottom: 50px;
                box-sizing:border-box;
                height:100%;
                overflow-y:scroll;
            }

            .staff-product-view .form {
                display:flex;
                flex-direction: column;
                gap: 5px;
                padding: 10px;
            }

            .staff-product-view .form .input-container {
                display:flex;
                flex-direction: row;
                gap:10px;
            }

            .staff-product-view .form .input-container .input {
                width: 100%;
            }
        </style>
    `;
};