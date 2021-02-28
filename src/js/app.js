import '../scss/app.scss';

// Your JS Code goes here
import Stories from '../components/stories/stories.js'



let stories = document.querySelectorAll(".story");

stories.forEach(story => {
  let element = new Stories();
  element.init(story)
  element.log()
})