export default (member) => {
    return `
        <span class="heavy-text span-name">${member.names} ${member.surnames}</span>
        <div class="separator"></div>
        <span id="member-points" class="heavy-text points">PUNTOS ACTUALES: <b>${member.points}</b></span>
        
        <span class="light-text">Formulario para sumar puntos a este usuario.</span>
        <form class="form-member" id="form-add-points">
            <input class="input" id="input-add-points" type="number" min="1" placeholder="Sumar puntos" required />
            <button class="button" type="submit">Sumar</button>
        </form>

        <span class="light-text">Formulario para reemplazar los puntos de este usuario.</span>
        <form class="form-member" id="form-set-points">
            <input class="input" id="input-set-points" type="number" min="0" placeholder="Reemplazar puntos" required />
            <button class="button danger" type="submit">Reemplazar</button>
        </form>
    `;
};