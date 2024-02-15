const displayStatusRequest = (message: string, error: boolean) => {
    var status_div = document.querySelector('.header__marge')!
    if (error) {
        status_div.innerHTML = `<div class="header__message error">` + message + `</div>`
    } else {
        status_div.innerHTML = `<div class="header__message succes">` + message + `</div>`
    }
}
export default displayStatusRequest;