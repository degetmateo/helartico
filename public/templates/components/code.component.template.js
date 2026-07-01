export default (data) => {
    const code = data.code;
    const mid = Math.floor(code.length / 2);
    const formatted = `${code.slice(0, mid)}-${code.slice(mid)}`;
    
    const status = {
        "PENDING": "PENDIENTE",
        "RECLAIMED": "RECLAMADO"
    };
    
    return `
        <span class="code">${formatted}</span>
        <span class="status">${status[data.status]}</span>
    `;
};