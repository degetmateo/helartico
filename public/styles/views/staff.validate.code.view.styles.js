export default () => {
    return `
        <style>
            .staff-validate-code-view .main {
                padding-top: 50px;
                padding-bottom: 50px;
            }

            .staff-validate-code-view .main .form {
                display:flex;
                flex-direction:column;
                gap:10px;

                padding:10px;
            }


            .staff-validate-code-view .main .form .code-input {
                letter-spacing: 2px;
            }

            .staff-validate-code-view .main .code-data-container {
                display:flex;
                flex-direction:column;
                gap: 10px;
                padding:10px;
            }
                
            .staff-validate-code-view .main .code-data-container .code-data-status .status-success {
                color: #0004ff;
            }

            .staff-validate-code-view .main .code-data-container .code-data-status .status-error {
                color: var(--danger);
            }
        </style>
    `;
};