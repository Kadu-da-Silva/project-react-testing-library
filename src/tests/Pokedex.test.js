import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import pokemonList from '../data';
import App from '../App';

describe('Testa componente Pokedex', () => {
  it('Teste se a página contém um heading h2 com o texto Encountered Pokémon', () => {
    renderWithRouter(<App />);

    const headingEl = screen.getByRole('heading', { name: /Encountered Pokémon/i, level: 2 });
    expect(headingEl).toBeDefined();
  });

  it('Teste se é exibido o próximo Pokémon da lista quando o botão Próximo Pokémon é clicado', () => {
    renderWithRouter(<App />);

    // O botão deve conter o texto Próximo Pokémon
    const button = screen.getByRole('button', { name: /Próximo Pokémon/i });
    expect(button).toBeDefined();

    // Os próximos Pokémon da lista devem ser mostrados, um a um, ao clicar sucessivamente no botão
    for (let i = 0; i < pokemonList.length; i += 1) {
      const pokemon = pokemonList[i];
      const pokemonName = screen.getByText(pokemon.name);
      expect(pokemonName).toBeDefined();

      userEvent.click(button);

      const pokemonsId = screen.getAllByRole('link', { name: /More details/i });
      expect(pokemonsId).toHaveLength(1);
    }

    // O primeiro Pokémon da lista deve ser mostrado ao clicar no botão, se estiver no último Pokémon da lista
    for (let i = 0; i < 9; i += 1) {
      userEvent.click(button);
    }
    expect(screen.getByText('Pikachu'));
  });

  it('Teste se é mostrado apenas um Pokémon por vez', () => {
    renderWithRouter(<App />);

    const allPokemon = screen.getAllByTestId('pokemon-name');
    expect(allPokemon).toHaveLength(1);
  });

  it('Teste se a Pokédex tem os botões de filtro', () => {
    renderWithRouter(<App />);

    // Deve existir um botão de filtragem para cada tipo de Pokémon, sem repetição
    const buttons = screen.getAllByTestId('pokemon-type-button');
    const typeList = [...new Set(pokemonList.map((pokemon) => pokemon.type))];
    expect(buttons).toHaveLength(typeList.length);

    const buttonAll = screen.getByRole('button', { name: 'All' });

    // A partir da seleção de um botão de tipo, a Pokédex deve circular somente pelos Pokémon daquele tipo
    for (let i = 0; i < typeList.length - 1; i += 1) {
      const buttonType = screen.getAllByTestId('pokemon-type-button')[i];
      userEvent.click(buttonType);

      const typeSpecific = pokemonList
        .filter((pokemon) => pokemon.type === buttonType.textContent)
        .map((pokemon) => pokemon.name);
      const buttonNext = screen.getByRole('button', { name: /Próximo Pokémon/i });

      if (typeSpecific.length === 1) {
        expect(buttonNext).toBeDisabled();
      } else {
        expect(buttonNext).toBeEnabled();
        for (let x = 0; x < typeSpecific.length - 1; x += 1) {
          const name = screen.getAllByTestId('pokemon-name')[x];
          expect(name.textContent).toBe(typeSpecific[x]);
          userEvent.click(buttonNext);
        }
      }

      // O texto do botão deve corresponder ao nome do tipo, ex. Psychic
      expect(typeList.includes(buttonType.textContent)).toBe(true);

      // O botão All precisa estar sempre visível
      expect(buttonAll).toBeVisible();
    }

    userEvent.click(buttonAll);
    expect(screen.getByText('Pikachu'));
  });
});
