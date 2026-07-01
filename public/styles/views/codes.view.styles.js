export default () => {
    return `
        <style>
            .codes .main {
                padding-top: 50px;
                padding-bottom: 50px;
                box-sizing:border-box;
                height:100%;
                overflow-y:scroll;
            }

            .codes .main .message {
                padding: 10px;
                text-align:center;
                border-bottom: 1px solid var(--log-cabin);
            }
        </style>
    `;
};