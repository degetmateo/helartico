export default () => {
    return `
        <style>
            .mp-view .main {
                padding-top: 50px;
                padding-bottom: 50px;
                box-sizing:border-box;
                height:100%;
                overflow-y:scroll;
            }

            .mp-view .main .container {
                box-sizing: border-box;
                padding:10px;

                display:flex;
                flex-direction:column;
                gap:10px;
            }

            .mp-view .member-form {
                display:flex;
                flex-direction:row;
                align-items:center;
                gap: 10px;
            }

            .mp-view .member-form .input {
                width: 100%;
            }
        </style>
    `;  
};