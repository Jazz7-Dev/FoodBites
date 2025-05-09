/* eslint-env jest */
/* global describe, test, expect */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for matchers like toBeInTheDocument
import Login from '../components/Login';
import axios from 'axios';

import { jest } from '@jest/globals';

jest.mock('axios');

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to input username and password', () => {
    render(<Login />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpass');
  });

  test('disables inputs and button while loading', () => {
    render(<Login />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });

    fireEvent.click(loginButton);

    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(loginButton).toBeDisabled();
  });

  test('displays error message on failed login', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(<Login setToken={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMessage = await screen.findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls setToken on successful login', async () => {
    const mockSetToken = jest.fn();
    axios.post.mockResolvedValue({ data: { token: 'mockToken' } });

    render(<Login setToken={mockSetToken} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'testpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await screen.findByRole('button', { name: /login/i }); // wait for re-render
    expect(mockSetToken).toHaveBeenCalledWith('mockToken');
  });
});
