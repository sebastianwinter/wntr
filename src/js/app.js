import '../scss/app.scss';

import SmoothScroll from "smooth-scroll"

// Your JS Code goes here
import Stories from '../components/stories/stories.js'
import Hero from '../components/hero/hero.js'



let stories = document.querySelectorAll(".story");

stories.forEach(story => {
  let element = new Stories();
  element.init(story)
  element.log()
})

let heroEl = document.querySelector(".hero");
let hero = new Hero();
hero.init(heroEl)


var scroll = new SmoothScroll('a[href*="#"]');