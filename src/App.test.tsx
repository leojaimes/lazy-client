import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  it('Renders hello world', () => {
    // ARRANGE

    // EXPECT
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Hello World'
    );
  });
  it('Renders not found if invalid path', () => {
    // render(
    //     <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
    //         <App />
    //     </MemoryRouter>
    // );
    // expect(
    //     screen.getByRole('heading', {
    //         level: 1,
    //     })
    // ).toHaveTextContent('Not Found');
  });
});
