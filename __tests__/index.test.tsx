import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../pages/index';
import "@testing-library/jest-dom";
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// windows.matchMedia for browser environment testing
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: function () { },
    removeListener: function () { }
  };
};

describe('Homepage rendering testing', () => {
  test('should render the navbar', async () => {
    render(<Home />)
    const navbar = await screen.getByText(/Words!/i)
    expect(navbar).toBeInTheDocument()
  })

  test('should render the delete word button', async () => {
    render(<Home />)
    const deleteWordButton = await screen.getByRole('button', { name: /Delete a Word/i })
    expect(deleteWordButton).toBeInTheDocument()
  })

  test('should render the input form', async () => {
    render(<Home />)
    const input = await screen.getByRole('textbox')
    const submitButton = await screen.getByRole('button', { name: /Submit/i })
    const inputPlaceholder = await screen.getByPlaceholderText('Enter a word:')
    expect(input).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(inputPlaceholder).toBeInTheDocument()
  })
})

describe('API testing for POST and DELETE', () => {
  const mock = new MockAdapter(axios)

  afterEach(() => {
    mock.reset()
  })

  test('displays error message for invalid input', async () => {
    mock.onPost('https://words.boondoc.co/words').reply(400)

    render(<Home />)
    const wordInput = await screen.getByPlaceholderText('Enter a word:')
    const submitButton = await screen.getByText('Submit')

    fireEvent.change(wordInput, { target: { value: 'test' } })
    fireEvent.click(submitButton)

    const toastText = await screen.findByText('Invalid input')
    expect(toastText).toBeInTheDocument()
  })

  test('displays error message for unknown error', async () => {
    mock.onPost('https://words.boondoc.co/words').reply(500)

    render(<Home />)
    const wordInput = await screen.getByPlaceholderText('Enter a word:')
    const submitButton = await screen.getByText('Submit')

    fireEvent.change(wordInput, { target: { value: 'test' } })
    fireEvent.click(submitButton)

    const toastText = await screen.findByText('Unknown error')
    expect(toastText).toBeInTheDocument()
  })

  test('displays error message for collection full', async () => {
    mock.onPost('https://words.boondoc.co/words').reply(503)

    render(<Home />)
    const wordInput = await screen.getByPlaceholderText('Enter a word:')
    const submitButton = await screen.getByText('Submit')

    fireEvent.change(wordInput, { target: { value: 'test' } })
    fireEvent.click(submitButton)

    const toastText = await screen.findByText('Word collection full')
    expect(toastText).toBeInTheDocument()
  })

  test('displays error message for unexpected error', async () => {
    mock.onPost('https://words.boondoc.co/words').reply(404)

    render(<Home />)
    const wordInput = await screen.getByPlaceholderText('Enter a word:')
    const submitButton = await screen.getByText('Submit')

    fireEvent.change(wordInput, { target: { value: 'test' } })
    fireEvent.click(submitButton)

    const toastText = await screen.findByText('Unexpected error')
    expect(toastText).toBeInTheDocument()
  })

  test('displays success message for successful word add', async () => {
    mock.onPost('https://words.boondoc.co/words').reply(201)

    render(<Home />)
    const wordInput = await screen.getByPlaceholderText('Enter a word:')
    const submitButton = await screen.getByText('Submit')

    fireEvent.change(wordInput, { target: { value: 'test' } })
    fireEvent.click(submitButton)

    const toastText = await screen.findByText('successfully added!', { exact: false }) // non exact match
    expect(toastText).toBeInTheDocument()
  })

  test('displays success message for successful word delete', async () => {
    mock.onDelete('https://words.boondoc.co/words').reply(200, 'deletedWord')

    render(<Home />)
    const deleteWordButton = await screen.getByRole('button', { name: /Delete a Word/i })

    fireEvent.click(deleteWordButton)

    const toastText = await screen.findByText('"deletedWord" successfully deleted!') 
    expect(toastText).toBeInTheDocument()
  })

  test('displays error message for empty word collection', async () => {
    mock.onDelete('https://words.boondoc.co/words').reply(404)

    render(<Home />)
    const deleteWordButton = await screen.getByRole('button', { name: /Delete a Word/i })

    fireEvent.click(deleteWordButton)

    const toastText = await screen.findByText('Word collection is empty')
    expect(toastText).toBeInTheDocument()
  })
})




  










