const jcssObj = %jcssObj%
      
export default jcssObj;

const stylesToInject = `
%rules%
`;

const key = (Object.keys(jcssObj)||[null]).shift();

if(key) {
  let section = document.querySelector('style[data-modules="css-server"]');

  if(!section) {
    section = document.createElement('style');
    section.setAttribute('data-modules', 'css-server');
    document.head.appendChild(section);
    section.innerHTML += stylesToInject;
  }else if(section.innerHTML.indexOf(key) != -1) {
    console.error('Selector already exist in the target style section');
  }else {
    section.innerHTML += stylesToInject;
  }
}else{
  console.error('Downloaded css object has no keys');
}

