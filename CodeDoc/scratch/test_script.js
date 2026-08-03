import { parseComponent } from '../../src/utils/parseComponent.js';

const code = `
  export default function Button({ label = 'Click me', onClick }) {
    return <button onClick={onClick}>{label}</button>;
  }
`;

console.log(parseComponent(code));
