import styles from './ExampleClass2.css';

export default class ExampleClass2 {
  constructor() {
    this.createTable();
  }

  createTable() {
    const container = document.createElement('div');
    const table = document.createElement('div');
    const tr1 = document.createElement('div');
    const tr2 = document.createElement('div');
    const tr3 = document.createElement('div');
    const tr4 = document.createElement('div');
    const tr5 = document.createElement('div');
    const info = document.createElement('div');
    
    container.className = styles.container;
    table.className = styles.table;
    tr1.className = styles.tr;
    tr2.className = `${styles.tr} ${styles.active}`;
    tr3.className = styles.tr;
    tr4.className = styles.tr;
    tr5.className = styles.tr;

    tr1.innerHTML = 'This is tr1';
    tr2.innerHTML = 'This is tr2, and this is active';
    tr3.innerHTML = 'This is tr3';
    tr4.innerHTML = 'This is tr4';
    tr5.innerHTML = 'This is tr5';
    info.innerHTML = 'This is info';
    
    table.appendChild(info);
    table.appendChild(tr1);
    table.appendChild(tr2);
    table.appendChild(tr3);
    table.appendChild(tr4);
    table.appendChild(tr5);
    container.appendChild(table);
    document.body.appendChild(container);
  }
}

