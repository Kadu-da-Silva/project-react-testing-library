import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import pokemonList from '../data';
import App from '../App';

describe('Testa componente Pokemon', () => {
  it('Teste se é renderizado um card com as informações de determinado Pokémon', () => {
    renderWithRouter(<App />);

    const { name, type, averageWeight: { value, measurementUnit } } = pokemonList[0];
    const namePokemon = screen.getByTestId('pokemon-name');
    const typePokemon = screen.getByTestId('pokemon-type');
    const weightPokemon = screen.getByTestId('pokemon-weight');
    const imgPokemon = screen.getByRole('img', { name: `${name} sprite` });

    expect(namePokemon.textContent).toBe(name);
    expect(typePokemon.textContent).toBe(type);
    expect(weightPokemon.textContent).toBe(`Average weight: ${value} ${measurementUnit}`);
    expect(imgPokemon).toHaveAttribute('src', 'https://archives.bulbagarden.net/media/upload/b/b2/Spr_5b_025_m.png');
    expect(imgPokemon).toHaveAttribute('alt', `${name} sprite`);
  });

  it('Teste Link de navegação do Pokémon e Favoritos', () => {
    const { history } = renderWithRouter(<App />);
    const { id, name } = pokemonList[0];

    // Teste se o card do Pokémon indicado na Pokédex contém um link de navegação para exibir detalhes deste Pokémon. O link deve possuir a URL /pokemon/<id>, onde <id> é o id do Pokémon exibido
    const link = screen.getByRole('link', { name: /More details/i });
    expect(link).toBeDefined();

    userEvent.click(link);

    const { pathname } = history.location;
    expect(pathname).toBe(`/pokemon/${id}`);

    // Teste se existe um ícone de estrela nos Pokémon favoritados
    const checkboxFavorite = screen.getByRole('checkbox', { name: /Pokémon favoritado\?/i });
    userEvent.click(checkboxFavorite);

    const iconStar = screen.getByRole('img', { name: `${name} is marked as favorite` });
    expect(iconStar).toBeVisible();
    expect(iconStar).toHaveAttribute('src', '/star-icon.svg');
  });
});
