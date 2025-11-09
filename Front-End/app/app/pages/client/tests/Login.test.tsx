import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Importa la función que quieres "mockear"
import { loginUser } from '../../../../scripts/auth.js';

// Importa el componente del Login
import Login from '../Login';

// autenticación
jest.mock('../../../../scripts/auth.js');

// Cliente de supabase
jest.mock('../../../../scripts/supabaseClient.js');

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const mockedLoginUser = loginUser as jest.Mock;

describe('Login Screen', () => {
  // mock de "navigation"
  const mockNavigation = {
    replace: jest.fn(),
    navigate: jest.fn(),
  };

  // Limpia los mocks al final
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLoginUser.mockClear();
    (Alert.alert as jest.Mock).mockClear();
  });

  // --- CASO 1: LOGIN INCORRECTO ---
  it('debe mostrar un mensaje de error con credenciales incorrectas', async () => {
    // Preparacion
    const errorMessage = 'Invalid login credentials';
    mockedLoginUser.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    const { getByTestId, findByTestId } = render(
      <Login navigation={mockNavigation} />
    );

    // Actua
    fireEvent.changeText(getByTestId('email-input'), 'usuario@incorrecto.com');
    fireEvent.changeText(getByTestId('password-input'), 'pass-incorrecta');
    fireEvent.press(getByTestId('login-button'));

    // Validacion
    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith(
        'usuario@incorrecto.com',
        'pass-incorrecta'
      );
    });

    const errorText = await findByTestId('login-error');
    expect(errorText).toBeTruthy();
    expect(errorText.props.children).toBe(errorMessage);
    expect(Alert.alert).toHaveBeenCalledWith('Error de login', errorMessage);
    expect(mockNavigation.replace).not.toHaveBeenCalled();
  });

  // --- CASO 2: LOGIN CORRECTO ---
  it('debe navegar a "Community" con credenciales correctas', async () => {
    // Preparacion
    
    // Email correcto
    const userEmail = 'a00574110@tec.mx';
    
    mockedLoginUser.mockResolvedValue({
      data: { user: { email: userEmail, id: '123' } },
      error: null,
    });

    const { getByTestId, findByTestId } = render(
      <Login navigation={mockNavigation} />
    );

    // Actua
    fireEvent.changeText(getByTestId('email-input'), userEmail);
    
    // Correct password
    fireEvent.changeText(getByTestId('password-input'), '123456');
    
    fireEvent.press(getByTestId('login-button'));

    // Validacion
    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith(
        userEmail,
        '123456'
      );
    });

    const successText = await findByTestId('login-success');
    expect(successText).toBeTruthy();
    expect(successText.props.children).toBe(`Bienvenido ${userEmail}`);
    expect(Alert.alert).toHaveBeenCalledWith('Éxito', `Bienvenido ${userEmail}`);
    expect(mockNavigation.replace).toHaveBeenCalledWith('Community');
  });
});
