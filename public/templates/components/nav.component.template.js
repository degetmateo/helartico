export default () => {
    return `
        <div class="nav-button" href="/home">
            <i class="fa-solid fa-house"></i>
        </div> 
        
        <div class="nav-button" href="/codes">
            <i class="fa-solid fa-receipt"></i>
        </div> 
        
        <div class="nav-button" href="/profile">
            <i class="fa-solid fa-circle-user"></i>
        </div>

        <div class="nav-button" href="/staff" id="nav-button-staff" style="display:none;">
            <i class="fa-solid fa-user-shield"></i>
        </div>
    `;
};