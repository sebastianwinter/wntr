//import './stories.scss';

// Your JS Code goes here


export default class Stories {
    init(root) {
        this.root = root
        this.open = false;
        this.paused = false;
        this.pausedTime = false;
        this.itemIndex = 0;
        this.progress = 0;
        this.itemCount = null;
        this.story = null;
        this.storyBullets = [];
        this.rafID

        this.addEvents()
    }

    log() {
        console.log(this.root)
    }

    addEvents() {
        this.root.querySelector(".story__cover").addEventListener('click', e => {
            //story = this.root
            if(!this.root.classList.contains('is-open')) {
                this.initStory(this.root)	
                this.root.classList.add('is-open');
            }
        })
        this.root.querySelector(".story__box").addEventListener('mousedown', e => {
            this.pauseStart(e)
        })
        this.root.querySelector(".story__box").addEventListener('mouseup', e => {
            this.pauseEnd()
        })
        this.root.querySelector(".story__box").addEventListener('touchstart', e => {
            this.pauseStart(e)
        })
        this.root.querySelector(".story__box").addEventListener('touchend', e => {
            this.pauseEnd()
        })
        this.root.querySelector(".story__prev").addEventListener('click', e => {
            if(!this.pausedTime) {
            if(this.itemIndex ==  0) {
                this.progress = 0;
            } else {
                this.storyBullets[this.itemIndex].style.width = '0%';
                this.itemIndex = this.itemIndex - 1
                this.progress = 0;
                this.pushFront(this.itemIndex)	
            }
            }
            this.pausedTime = false
        })
        this.root.querySelector(".story__next").addEventListener('click', e => {
            if(!this.pausedTime) {
            if(this.itemIndex == this.itemCount - 1) {
                this.close()
                this.root.querySelector('.story__cover').style.border = "2px solid #d3d3d3";
            } else {
                this.storyBullets[this.itemIndex].style.width = '100%';
                this.progress = 0;
                this.itemIndex = this.itemIndex + 1
                this.pushFront(this.itemIndex)	
            }
            }
            this.pausedTime = false
        })
        this.root.querySelector(".story__close").addEventListener('click', e => {
            this.close()
        })
    }


    pauseStart(e) {
        this.paused = e;
        cancelAnimationFrame(this.rafID)
        let currentItem = this.root.querySelectorAll(".story__item")[this.itemIndex]
        if(currentItem.classList.contains('story__item--video')) {
            currentItem.pause();		
        }
        setTimeout(function(){
            if(this.paused && this.paused == e) {
                this.pausedTime = true;
                this.root.querySelector('.story__bullets').classList.add('is-paused')
                this.root.querySelector('.story__close').classList.add('is-paused')
            }
        }, 500);
    }
    
    pauseEnd() {
        if(this.paused) {
            this.paused = false;
            let currentItem = this.root.querySelectorAll(".story__item")[this.itemIndex]
            if(currentItem.classList.contains('story__item--video')) {
                currentItem.play();
            }
            animate(this)
        }
        this.root.querySelector('.story__bullets').classList.remove('is-paused')
        this.root.querySelector('.story__close').classList.remove('is-paused')
    }
    
    
    close() {
        this.root.classList.remove('is-open');
        this.root.querySelector(".story__bullets").innerHTML = "";
        this.itemIndex = 0;
        this.progress = 0;
        this.open = false
        //document.querySelector('.menu').style.display = "block";
    }
    
    initStory() {
        this.open = true
        this.itemCount = this.root.querySelectorAll(".story__item").length;
        this.addBullets(this.itemCount)
        this.storyBullets = this.root.querySelectorAll('.story__bullet span')
        this.pushFront(this.itemIndex)
        animate(this)
        //document.querySelector('.menu').style.display = "none";
    }
    
    addBullets(items) {
        var i;
        for (i = 0; i < items; i++) {
            var newNode = document.createElement('div');
            newNode.className = 'story__bullet story__bullet--' + i;
            newNode.innerHTML ="<span></span>";
            this.root.querySelector(".story__bullets").appendChild(newNode);  	
        }
    }
    
    pushFront(index) {
        let items = this.root.querySelectorAll(".story__item");
        items.forEach(item => {
            item.classList.remove('is-front')
            if(item.classList.contains('story__item--video')) {
                item.pause();
            }
        })
        items[index].classList.add('is-front')
        if(items[index].classList.contains('story__item--video')) {
            items[index].currentTime = 0;
            items[index].play();
        }
    }

    /*animate() {
        console.log(this.progress)
        if(this.open) {
            this.progress = this.progress + 0.5
            console.log(this.storyBullets[this.itemIndex])
            this.storyBullets[this.itemIndex].style.width = this.progress + '%';
        }   
    
        //continue / switch img
        if(this.progress >= 100) {
            if(this.itemIndex == this.itemCount - 1) {
                this.close()
                this.root.querySelector('.story__cover').style.border = "2px solid #d3d3d3";
            } else {
                this.itemIndex = this.itemIndex + 1
                this.pushFront(this.itemIndex)
                this.progress = 0
                //console.log('again / next')
                this.rafID = requestAnimationFrame(this.animate)
            }
        } else if(this.open && !this.paused) {
            //console.log('again')
            //request animation Frame not workin properly
            let self = this;
            this.rafID = requestAnimationFrame(self.animate)
            //this.rafID = window.webkitRequestAnimationFrame(() => this.animate());
        }
    }*/
    
}

function animate(story) {
    console.log(story.progress)
    if(story.open) {
        story.progress = story.progress + 0.5
        console.log(story.storyBullets[story.itemIndex])
        story.storyBullets[story.itemIndex].style.width = story.progress + '%';
    }   

    //continue / switch img
    if(story.progress >= 100) {
        if(story.itemIndex == story.itemCount - 1) {
            story.close()
            story.root.querySelector('.story__cover').style.border = "2px solid #d3d3d3";
        } else {
            story.itemIndex = story.itemIndex + 1
            story.pushFront(story.itemIndex)
            story.progress = 0
            //console.log('again / next')
            //story.rafID = requestAnimationFrame(animate)
            story.rafID = requestAnimationFrame(() => animate(story))
        }
    } else if(story.open && !story.paused) {
        //console.log('again')
        //request animation Frame not workin properly
        //story.rafID = requestAnimationFrame(animate)
        story.rafID = requestAnimationFrame(() => animate(story))
    }
}


