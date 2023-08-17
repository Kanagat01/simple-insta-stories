class SlideStories {
    /** @param {Number} id */
    constructor(id) {
        this.slide = document.getElementById(id)
        this.order = Number(this.slide.getAttribute("data-order"))
        this.active = 0
        this.init()
    }

    init() {
        this.next = this.next.bind(this)
        this.prev = this.prev.bind(this)
        this.items = this.slide.querySelectorAll('.slide-items > *')
        this.thumb = this.slide.querySelector('.slide-thumbs')
        this.addThumbItems()
        this.activeSlide(0)
        this.addNavigation()
    }

    /** @param {Number} index */
    activeSlide(index) {
        this.active = index
        this.items.forEach((item) => item.classList.remove('active'))
        this.items[index].classList.add('active')
        this.thumbItems.forEach((item) => item.classList.remove('active'))
        this.thumbItems[index].classList.add('active')

        // const activeImagePath = this.items[index].getAttribute('src')

        // document.querySelectorAll(".modal-overlay").forEach((el) => {
        //     el.style.backgroundImage = `url(${activeImagePath})`
        //     el.style.backgroundRepeat = "no-repeat";
        //     el.style.backgroundSize = "cover";
        //     el.style.backgroundPosition = "center";
        //     // this.slide.style.backdropFilter = "blur(10px)";
        // })
        this.autoSlide()
    }

    next() {
        if (this.active < this.items.length - 1) {
            this.activeSlide(this.active + 1)
        } else {
            let newOrder = this.order + 1
            let nextSlide = document.getElementById(`slide_${newOrder}`)
            this.slide.style.display = "none"
            if (nextSlide) {
                nextSlide.style.display = "grid"
                stories[newOrder].activeSlide(0)
            } else {
                document.getElementById('modalOverlay').style.display = "none";
                stories.forEach((el) => el.slide.style.display = "none")
            }
        }
    }

    prev() {
        if (this.active > 0) {
            this.activeSlide(this.active - 1)
        } 
        else {
            let newOrder = this.order - 1
            let prevSlide = document.getElementById(`slide_${newOrder}`)
            this.slide.style.display = "none"
            if (prevSlide) {
                prevSlide.style.display = "grid"
                stories[newOrder].activeSlide(stories[newOrder].items.length - 1)
            } else {
                document.getElementById('modalOverlay').style.display = "none";
                stories.forEach((el) => el.slide.style.display = "none")
            }
        }
    }

    addNavigation() {
        const nextBtn = this.slide.querySelector('.slide-next')
        const prevBtn = this.slide.querySelector('.slide-prev')
        nextBtn.addEventListener('click', this.next)
        prevBtn.addEventListener('click', this.prev)

        let x1 = null;
        let y1 = null;
        
        let handleTouchStart = (event) => {
            const firstTouch = event.touches[0];
            x1 = firstTouch.clientX;
            y1 = firstTouch.clientY;
        }

        let handleTouchEnd = (event) => {
            if (!x1 || !y1) return false;

            let x2 = event.changedTouches[0].clientX;
            let y2 = event.changedTouches[0].clientY;
            let xDiff = x2 - x1;
            let yDiff = y2 - y1;
        
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 0) {
                    this.prev()
                } else {
                    this.next()
                }
            } else {
                if (yDiff < 0) {
                    document.getElementById('modalOverlay').style.display = "none";
                    stories.forEach((el) => el.slide.style.display = "none")
                }
            }
        }

        this.slide.addEventListener('touchstart', handleTouchStart, false)
        this.slide.addEventListener('touchend', handleTouchEnd, false)
    }

    addThumbItems() {
        this.items.forEach(() => (this.thumb.innerHTML += `<span class="slide-thumb-item"></span>`))
        this.thumbItems = Array.from(this.thumb.children)
    }

    autoSlide() {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            if (this.slide.style.display === "grid") {
                this.next()
            }
        }, 5000)
    }
}

let stories = []
document.querySelectorAll(".slide").forEach((el) => {
    let slide = new SlideStories(el.id)
    stories.push(slide)
})

function open_slide(id) {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'block';
    let currentSlide = document.getElementById(id)
    currentSlide.style.display = "grid"
    stories[currentSlide.getAttribute("data-order")].activeSlide(0)
}

// Закрыть слайд
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.style.display = 'none';
        stories.forEach((el) => el.slide.style.display = "none")
    }
});