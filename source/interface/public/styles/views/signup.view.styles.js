export default () => {
    return `
        <style>
            .signup-view {
                width:100%;
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .signup-form {
                display:flex;
                flex-direction:column;
                padding:10px;
                gap:10px;
                width:100%;
            }

            .signup-input {
                padding:10px;
                border-radius:10px;
                outline:1px solid #000;
                border:none;
            }

            .signup-input:focus {
                border:none;
                outline: 3px solid brown;
            }

            .signup-button {
                padding:10px;
                background-color: var(--color-main-darker);
                border-radius:10px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:20px;
                cursor:pointer;
                border:none;
            }
            
            .signup-button:active {
                background-color:var(--color-hover);
            }

            @media (min-width:512px) {
                .signup-form {
                    width:512px;
                }
            }
        </style>
    `;
};