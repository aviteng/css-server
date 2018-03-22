import styles from './ExampleClass.css';

export default class ExampleClass {
  constructor() {
    const div = document.createElement('div');
    div.className = styles.exampleSelector;

    document.body.appendChild(div);
   
    setTimeout(() => {
      div.className += ' ' + styles.secondExampleSelector;
    }, 2000);
  }
}
