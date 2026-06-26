export default (data) => {
    return `
        <img src="${data.image.url}" class="thumbnail" />
        <span class="name">${data.name}</span>
        <button id="exchange-button" class="button">CANJEAR POR ${data.exchange_points} PUNTOS</button>
    `;
};