export default %jsClass%

const stylesToInject = `
%rules%
`;


let section = document.querySelector('style[data-modules="modules"]');
if(!section) {
  section = document.createElement('style');
  section.setAttribute('data-modules', 'css-server');
  document.head.appendChild(section);
}
section.innerHTML += stylesToInject;
