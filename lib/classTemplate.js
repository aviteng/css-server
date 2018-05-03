const jcssObj = %jcssObj%;
      
export default jcssObj;

const stylesToInject = `
%rules%
`;

const key = (Object.keys(jcssObj)||[null]).shift();

const section = document.createElement('style');
section.setAttribute('data-modules', 'css-server');
document.head.appendChild(section);
section.innerHTML += stylesToInject;
