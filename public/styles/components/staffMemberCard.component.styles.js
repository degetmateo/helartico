export default () => {
 return `
    <style>
        .app-staff-member-card {
            box-sizing: border-box;
            padding: 10px;
            border: 2px solid var(--log-cabin);
            border-radius: 5px;

            display:flex;
            flex-direction:column;
            gap: 10px;
        }

        .app-staff-member-card .span-name {
            font-size: 20px;
            font-weight: bolder;
        }

        .app-staff-member-card .form-member {
            display:flex;
            flex-direction:row;
            gap:10px;
        }

        .app-staff-member-card .form-member .input {
            width:100%;
        }

        .app-staff-member-card .points {
            font-size: 20px;
        }
    </style>
 `;
};