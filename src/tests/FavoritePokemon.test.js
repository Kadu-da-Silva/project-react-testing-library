import React from 'react';
import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import { FavoritePokemon } from '../pages';

describe('Testa o component FavoritePokemon', () => {
  it('Teste se é exibida na tela a mensagem No favorite pokemon found, caso a pessoa não tenha Pokémon favoritos', () => {
    renderWithRouter(<FavoritePokemon pokemonList={ [] } />);

    const textMsg = screen.getByText('No favorite Pokémon found');
    expect(textMsg).toBeDefined();
  });

  it('Teste se apenas são exibidos os Pokémon favoritados', () => {
    const pokemonFavorite = [
      {
        id: 1,
        name: 'Pikachu',
        type: 'Eletric',
        averageWeight: {
          measurementUnit: 'kg',
          value: '6.0',
        },
        image: 'https://archives.bulbagarden.net/media/upload/0/0a/Spr_5b_004.png',
      },
      {
        id: 1,
        name: 'Charmander',
        type: 'Fire',
        averageWeight: {
          measurementUnit: 'kg',
          value: '8.5',
        },
        image: 'https://archives.bulbagarden.net/media/upload/b/b2/Spr_5b_025_m.png',
      },
    ];

    renderWithRouter(<FavoritePokemon pokemonList={ pokemonFavorite } />);

    const favorites = screen.getAllByTestId('pokemon-name');

    expect(favorites.length).toBe(2);

    expect(favorites[0]).toHaveTextContent('Pikachu');
    expect(favorites[1]).toHaveTextContent('Charmander');
  });
});
