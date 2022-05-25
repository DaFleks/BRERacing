window.addEventListener('load', () => {
    let images = document.querySelectorAll('.single-image');

    images.forEach((image) => {
        image.firstElementChild.classList.add('img-fluid');
        image.addEventListener('click', () => {
            document.querySelector('#imageModalBody').innerHTML = image.innerHTML;
        })
    })
});