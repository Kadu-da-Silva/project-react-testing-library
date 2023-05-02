import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from '../renderWithRouter';

describe('Testa o componente App', () => {
  it('O primeiro link deve possuir o texto Home', () => {
    renderWithRouter(<App />);

    const firstLink = screen.getByRole('link', { name: 'Home' });
    expect(firstLink).toBeDefined();
  });

  it('O segundo link deve possuir o texto About', () => {
    renderWithRouter(<App />);

    const secondLink = screen.getByRole('link', { name: 'About' });
    expect(secondLink).toBeDefined();
  });

  it('O terceiro link deve possuir o texto Favorite Pokémon', () => {
    renderWithRouter(<App />);

    const thirdyLink = screen.getByRole('link', { name: /Favorite Pokémon/i });
    expect(thirdyLink).toBeDefined();
  });

  it('Teste se a aplicação é redirecionada para a página inicial, na URL / ao clicar no link Home da barra de navegação', () => {
    const { history } = renderWithRouter(<App />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    userEvent.click(homeLink);

    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });

  it('Teste se a aplicação é redirecionada para a página de About, na URL /about, ao clicar no link About da barra de navegação', () => {
    const { history } = renderWithRouter(<App />);

    const aboutLink = screen.getByRole('link', { name: 'About' });
    userEvent.click(aboutLink);

    const { pathname } = history.location;
    expect(pathname).toBe('/about');
  });
  it('Teste se a aplicação é redirecionada para a página de Pokémon Favoritados, na URL /favorites, ao clicar no link Favorite Pokémon da barra de navegação', () => {
    const { history } = renderWithRouter(<App />);

    const favoriteLink = screen.getByRole('link', { name: 'Favorite Pokémon' });
    userEvent.click(favoriteLink);

    const { pathname } = history.location;
    expect(pathname).toBe('/favorites');
  });
  it('Teste se a aplicação é redirecionada para a página Not Found ao entrar em uma URL desconhecida', () => {
    const { history } = renderWithRouter(<App />);

    const INVALID_URL = '/dale';
    act(() => {
      history.push(INVALID_URL);
    });

    const notFoundText = screen.getByText('Page requested not found');
    expect(notFoundText).toBeDefined();
  });
});
