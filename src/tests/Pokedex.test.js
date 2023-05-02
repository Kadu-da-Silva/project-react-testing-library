import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { act } from 'react-dom/test-utils';
import renderWithRouter from '../renderWithRouter';
import App from '../App';

const pokemonNameId = 'pokemon-name'; // Para o Lint parar de encher o saco.
const pokemonTypeId = 'pokemon-type'; // Para o Lint parar de encher o saco.

describe('Testa o componente Pokedex', () => {
  it('Teste se a página contém um heading h2 com o texto Encountered Pokémon', () => {
    renderWithRouter(<App />);

    const headingEl = screen.getByRole('heading', { name: /Encountered Pokémon/i, level: 2 });
    expect(headingEl).toBeDefined();
  });

  it('Teste se é exibido o próximo Pokémon da lista quando o botão Próximo Pokémon é clicado', async () => {
    renderWithRouter(<App />);

    const button = screen.getByRole('button', { name: /Próximo Pokémon/i });
    expect(button).toBeDefined();

    // Obtém o nome do primeiro Pokémon exibido
    const previousPokemonName = screen.getByTestId(pokemonNameId).textContent;

    userEvent.click(button);

    // Obtém o nome do segundo Pokémon exibido
    const currentPokemonName = screen.getByTestId(pokemonNameId).textContent;

    // Verifica se o nome do primeiro Pokémon não está mais na tela
    expect(screen.queryByText(previousPokemonName)).not.toBeInTheDocument();

    // Verifica se o nome do segundo Pokémon está na tela
    expect(screen.queryByText(currentPokemonName)).toBeInTheDocument();
  });

  it('O primeiro Pokémon da lista deve ser mostrado ao clicar no botão, se estiver no último Pokémon da lista.', () => {
    renderWithRouter(<App />);

    let clickCount = 0;
    let nextButton = screen.getByRole('button', { name: /Próximo Pokémon/i });

    while (nextButton && clickCount < 9) {
      userEvent.click(nextButton);
      nextButton = screen.queryByRole('button', { name: /Próximo Pokémon/i });
      clickCount += 1;
    }

    expect(screen.getByTestId('pokemon-name')).toHaveTextContent('Pikachu');
  });

  it('Teste se é mostrado apenas um Pokémon por vez', () => {
    renderWithRouter(<App />);

    expect(screen.getByTestId(pokemonNameId)).toHaveTextContent('Pikachu');

    const button = screen.getByRole('button', { name: /Próximo Pokémon/i });
    userEvent.click(button);

    expect(screen.getByTestId(pokemonNameId)).toHaveTextContent('Charmander');
  });

  it('Deve existir um botão de filtragem para cada tipo de Pokémon, sem repetição', () => {
    renderWithRouter(<App />);

    const buttons = screen.getAllByTestId('pokemon-type-button');

    const buttonTexts = new Set(buttons.map((button) => button.textContent));

    expect(buttonTexts.size).toEqual(buttons.length);
  });

  it('A partir da seleção de um botão de tipo, a Pokédex deve circular somente pelos Pokémon daquele tipo', () => {
    renderWithRouter(<App />);

    const buttonType = screen.getByRole('button', { name: 'Fire' });
    userEvent.click(buttonType);

    expect(screen.getByTestId(pokemonTypeId)).toHaveTextContent('Fire');

    const buttonNext = screen.getByRole('button', { name: /Próximo Pokémon/i });
    userEvent.click(buttonNext);

    expect(screen.getByTestId(pokemonTypeId)).toHaveTextContent('Fire');
  });

  it('O texto do botão deve corresponder ao nome do tipo, ex. Psychic', () => {
    renderWithRouter(<App />);

    const buttonType = screen.getByRole('button', { name: 'Psychic' });
    userEvent.click(buttonType);

    const type = screen.getByTestId(pokemonTypeId).textContent;

    expect(buttonType.textContent).toBe(type);
  });

  it('O botão All precisa estar sempre visível', () => {
    renderWithRouter(<App />);

    const buttonType = screen.getByRole('button', { name: 'Psychic' });
    userEvent.click(buttonType);

    const buttonAll = screen.getByRole('button', { name: 'All' });
    expect(buttonAll).toBeDefined();
  });
});
