import { describe, it, expect } from 'vitest';
import { parseComponent } from '../parseComponent';

describe('parseComponent', () => {
  it('handles default-exported function declaration with JSDoc and destructured props', () => {
    const code = `
      /**
       * A button component
       */
      export default function Button({ label = 'Click me', onClick }) {
        return <button onClick={onClick}>{label}</button>;
      }
    `;
    const result = parseComponent(code);
    expect(result.name).toBe('Button');
    expect(result.description).toBe('A button component');
    expect(result.props).toEqual([
      { name: 'label', type: 'string', default: 'Click me', required: false },
      { name: 'onClick', type: 'any', default: null, required: true }
    ]);
  });

  it('handles named export function', () => {
    const code = `
      export function Button({ type = 'submit' }) {
        return <button type={type}></button>;
      }
    `;
    const result = parseComponent(code);
    expect(result.name).toBe('Button');
    expect(result.props).toEqual([
      { name: 'type', type: 'string', default: 'submit', required: false }
    ]);
  });

  it('handles anonymous default arrow export', () => {
    const code = `
      export default ({ text }) => {
        return <span>{text}</span>;
      };
    `;
    const result = parseComponent(code);
    expect(result.name).toBe('Component');
    expect(result.props).toEqual([
      { name: 'text', type: 'any', default: null, required: true }
    ]);
  });

  it('handles class component with static defaultProps', () => {
    const code = `
      import React from 'react';
      class Card extends React.Component {
        static defaultProps = {
          elevation: 2,
          active: false
        };
        render() {
          return <div>Card</div>;
        }
      }
      export default Card;
    `;
    const result = parseComponent(code);
    expect(result.name).toBe('Card');
    expect(result.props).toContainEqual({ name: 'elevation', type: 'number', default: '2', required: false });
    expect(result.props).toContainEqual({ name: 'active', type: 'boolean', default: 'false', required: false });
  });

  it('handles wrapped components (React.memo, React.forwardRef)', () => {
    const code = `
      import React from 'react';
      const Badge = React.memo(React.forwardRef(({ count = 0 }, ref) => {
        return <span ref={ref}>{count}</span>;
      }));
      export default Badge;
    `;
    const result = parseComponent(code);
    expect(result.name).toBe('Badge');
    expect(result.props).toContainEqual({ name: 'count', type: 'number', default: '0', required: false });
    expect(result.props).toContainEqual({ name: 'ref', type: 'any', default: null, required: true });
  });

  it('handles non-literal default prop values ([], {}, () => {})', () => {
    const code = `
      export default function List({ items = [], config = {}, onRender = () => {} }) {
        return <div></div>;
      }
    `;
    const result = parseComponent(code);
    expect(result.name).toBe('List');
    expect(result.props).toEqual([
      { name: 'items', type: 'array', default: '[]', required: false },
      { name: 'config', type: 'object', default: '{}', required: false },
      { name: 'onRender', type: 'function', default: '() => {}', required: false }
    ]);
  });

  it('handles defaultProps assignment merging & precedence', () => {
    const code = `
      export default function Avatar({ src, size = 24 }) {
        return <img src={src} width={size} />;
      }
      Avatar.defaultProps = {
        size: 48,
        alt: 'User avatar'
      };
    `;
    const result = parseComponent(code);
    expect(result.name).toBe('Avatar');
    expect(result.props).toContainEqual({ name: 'size', type: 'number', default: '48', required: false });
    expect(result.props).toContainEqual({ name: 'alt', type: 'string', default: 'User avatar', required: false });
  });

  it('handles TypeScript syntax detection', () => {
    const code = `
      export default function Header(props: { title: string }) {
        return <h1>{props.title}</h1>;
      }
    `;
    const result = parseComponent(code);
    expect(result.error).toBe("TypeScript syntax isn't supported - please paste JavaScript/JSX.");
  });
});
