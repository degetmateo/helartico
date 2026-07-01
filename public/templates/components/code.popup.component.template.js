export default (data) => {
    const code = data.code;
    const mid = Math.floor(code.length / 2);
    const formatted = `<b>${code.slice(0, mid)}</b>-<b>${code.slice(mid)}</b>`;
    
    return `
        <div class="code-container">
            <span class="code">${formatted}</span>
            <span class="light-text">¡Éxito! Has canjeado tus puntos. Mostrá este código en la caja para reclamar tu producto.</span>
        </div>
    `;
};